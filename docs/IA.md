# Information Architecture

## Концепция

Beauty OS — единая платформа, объединяющая специалистов и клиентов.

После авторизации пользователь получает интерфейс в соответствии со своей ролью.

---

# Пользователь

User

↓

Role Detection

- Professional
- Client
- Admin (будущее)

---

# Authentication

Login

↓

Firebase Authentication

↓

Role Detection

↓

┌───────────────────────┐
│                       │
Professional          Client
│                       │
↓                       ↓
Professional          Client
Dashboard             Dashboard

---

# Professional

Dashboard

Clients

Appointments

Visits

Services

Gallery

Recommendations

Documents

Analytics

Settings

---

# Client

Dashboard

Profile

Appointments

Visit History

Recommendations

Gallery

Documents

Notifications

Settings

---

# Общие сервисы

Authentication

Storage

Notifications

Search

Files

Settings

Offline

---

# Навигация

## Login

Login

↓

Authentication

↓

Role Detection

---

## Professional

Role Detection

↓

Professional Dashboard

↓

Clients

Appointments

Visits

Services

Gallery

Recommendations

Documents

Analytics

Settings

---

## Client

Role Detection

↓

Client Dashboard

↓

Profile

Appointments

Visit History

Recommendations

Gallery

Documents

Notifications

Settings

---

## Client Dashboard

Client Dashboard

↓

┌──────────────────────────────┐
│ Profile                      │
│                              │
│ Bonus                        │
│ Next Appointment             │
│ Visit History                │
└──────────────────────────────┘

↓

Client Articles

↓

Article

---

# Client Authentication

Client Login

↓

Firebase Authentication

↓

Search client by `authUid`

↓

Client found

↓

Client Dashboard

---

# Client Data Flow

Firebase Auth

↓

user.uid

↓

clients.authUid

↓

Client

↓

Client Dashboard

---

# Client Cabinet

## Dashboard

- Имя клиента
- Бонусы
- Ближайшая запись
- История посещений
- Статьи специалиста
- Выход из аккаунта

---

## Appointments

Client Dashboard

↓

Appointments

↓

- Предстоящие записи
- История записей

---

## Visit History

Client Dashboard

↓

Visit History

↓

- Дата посещения
- Процедура
- История процедур

---

## Articles

Client Dashboard

↓

Articles

↓

Article List

↓

Article

---

## Profile

Client Dashboard

↓

Profile

↓

Данные клиента

---

# Professional → Client

Специалист работает с клиентом через раздел Clients.

Clients

↓

Client

↓

Client Profile

↓

Create Client Login

↓

Firebase Authentication

↓

Client Account

↓

Client Dashboard

---

# Admin

Admin

**Статус: будущее**

Admin Dashboard и права администратора будут определены отдельно.

---

# Общая схема

                    Beauty OS
                        │
                        ↓
                Authentication
                        │
                        ↓
                  Role Detection
                   /           \
                  /             \
                 ↓               ↓
          Professional         Client
                 │               │
                 ↓               ↓
       Professional          Client
         Dashboard           Dashboard
                 │               │
        ┌────────┼───────┐   ┌───┼──────────────┐
        ↓        ↓       ↓   ↓   ↓              ↓
     Clients  Calendar Services Profile      Appointments
        │
        ↓
     Client
        │
        ↓
 Create Client Login
        │
        ↓
 Client Authentication
        │
        ↓
 Client Dashboard

---

# Текущий статус

## Реализовано

- Firebase Authentication
- Авторизация пользователя
- Определение пользователя
- Определение клиента через `authUid`
- Разделение интерфейса Professional / Client
- Клиентский Dashboard
- Клиентский профиль
- Клиентские записи
- История посещений
- Клиентские статьи
- Просмотр отдельной статьи
- Бонусы клиента
- Выход из аккаунта
- Создание доступа клиента из кабинета специалиста

## В разработке

- Полноценная система ролей
- Администратор
- Права доступа для разных ролей
- Полноценная регистрация клиента
- Расширение возможностей клиентского кабинета
- Уведомления
- Расширенная работа клиента с записями

---

# Принцип архитектуры

Beauty OS — единое приложение с несколькими ролями.

Один пользовательский вход определяет роль пользователя и направляет его в соответствующий кабинет.

```text
                    Beauty OS
                        │
                        ↓
                 Firebase Auth
                        │
                        ↓
                  Role Detection
                   /           \
                  /             \
                 ↓               ↓
          Professional          Client
                 ↓               ↓
        Professional          Client
          Dashboard           Dashboard
                 │               │
                 ↓               ↓
              CRM             Personal
                              Cabinet