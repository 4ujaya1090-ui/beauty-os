# Beauty OS — База данных (Firestore)

Проект: `beauty-os-ae06f`. Ниже — все коллекции как они есть в коде сейчас.

## `profiles/{uid}`

Один документ — на одного специалиста (сейчас в системе один). `{uid}` — Firebase Auth UID специалиста.

```ts
{
  name: string;
  specialization: string;

  workingHours?: {
    monday:    { enabled: boolean; start: string; end: string };
    tuesday:   { enabled: boolean; start: string; end: string };
    wednesday: { enabled: boolean; start: string; end: string };
    thursday:  { enabled: boolean; start: string; end: string };
    friday:    { enabled: boolean; start: string; end: string };
    saturday:  { enabled: boolean; start: string; end: string };
    sunday:    { enabled: boolean; start: string; end: string };
  };

  medicalCardLabels?: {
    field1: string; // по умолчанию "Аллергии"
    field2: string; // по умолчанию "Противопоказания"
    field3: string; // по умолчанию "Тип кожи"
  };
}
```

Если документ **не существует** для вошедшего пользователя, и он не найден как клиент — показывается `ProfileSetupPage` (создание профиля специалиста).

Клиент читает этот же документ через `useSpecialistProfile()` — берёт первый (единственный) найденный профиль, чтобы узнать график работы при самозаписи.

## `clients/{clientId}`

```ts
{
  name: string;
  phone: string;
  birthDate: string;

  allergies: string;         // подпись настраивается через profiles.medicalCardLabels.field1
  contraindications: string; // field2
  skin: string;               // field3

  lastVisit: string;
  bonus: number;
  photo: string;               // сейчас всегда заглушка, реальной загрузки нет (см. ROADMAP)

  authUid?: string;            // если специалист создал клиенту вход — Firebase Auth UID клиента
}
```

Названия полей `allergies`/`contraindications`/`skin` остались от косметологической специфики по историческим причинам — реально показываемые клиенту подписи берутся из `profiles.medicalCardLabels`, а не из названий полей.

## `procedures/{procedureId}`

```ts
{
  name: string;
  duration: number; // минуты
  price: number;
}
```

Общий список, не привязан к специалисту.

## `appointments/{appointmentId}`

```ts
{
  clientId: string;
  procedure: string;   // название процедуры на момент записи (не ссылка)
  duration: number;    // длительность на момент записи

  date: string;  // "2026-08-14"
  time: string;  // "14:30"

  comment?: string;    // внутренняя заметка специалиста, клиенту в интерфейсе не показывается
  photos?: string[];   // задел на будущее, Storage не подключён — сейчас всегда пусто
}
```

Название и длительность процедуры **копируются** в момент создания записи, а не читаются по ссылке — если специалист потом переименует процедуру в прайсе, старые записи не изменятся (это осознанно, а не баг).

## `articles/{articleId}`

```ts
{
  specialistId: string;
  title: string;
  content: string;
  category: string;
  image?: string;      // внешняя ссылка на картинку, не загрузка файла
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

`specialistId` — единственное место в проекте, где это поле уже есть, но реально не используется для фильтрации (специалист один).

## Правила доступа (Firestore Rules)

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isSpecialist() {
      return isSignedIn() &&
        exists(/databases/$(database)/documents/profiles/$(request.auth.uid));
    }

    function isOwnClientRecord() {
      return isSignedIn() && resource.data.authUid == request.auth.uid;
    }

    match /profiles/{uid} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == uid;
    }

    match /clients/{clientId} {
      allow read: if isSpecialist() || isOwnClientRecord();
      allow write: if isSpecialist();
    }

    match /procedures/{procedureId} {
      allow read: if isSignedIn();
      allow write: if isSpecialist();
    }

    match /appointments/{appointmentId} {
      allow read: if isSignedIn();
      allow create: if isSpecialist() ||
        (isSignedIn() &&
         get(/databases/$(database)/documents/clients/$(request.resource.data.clientId)).data.authUid == request.auth.uid);
      allow update, delete: if isSpecialist();
    }

    match /articles/{articleId} {
      allow read: if isSpecialist() ||
        (isSignedIn() && resource.data.published == true);
      allow write: if isSpecialist();
    }
  }
}
```

Ключевые решения:
- Клиент может **читать** чужие `procedures` и `appointments` (нужно для самозаписи — видеть прайс и занятые слоты), но не может их изменять
- Клиент может **создать** запись только для самого себя (`clientId` должен указывать на его же карточку) — не может записать "кого-то ещё"
- Редактировать/удалять записи клиент пока не может вообще — это делает только специалист

## Коллекция, которой больше нет

`professionalSettings/{uid}` — было заведено на раннем этапе обсуждения графика работы как альтернативный вариант, но так и не использовалось кодом (график хранится в `profiles.workingHours`). Код, который на неё ссылался, удалён. Если в консоли Firestore видна пустая коллекция `professionalSettings` — её можно удалить вручную, это не используется.
