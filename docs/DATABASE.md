# DATABASE

## Главная идея

Каждая сущность хранится отдельно.

Связь между сущностями осуществляется только через ID.

Никакого дублирования данных.

---

# Collections

users

clients

appointments

procedures

payments

bonuses

articles

notifications

---

# Client

id

name

phone

birthDate

photo

allergies

contraindications

skin

bonus

createdAt

updatedAt

---

# Procedure

id

name

description

duration

price

category

isActive

createdAt

updatedAt

---

# Appointment

id

clientId

procedureId

date

startTime

endTime

status

price

notes

createdAt

updatedAt

---

# Payment

id

appointmentId

clientId

amount

method

status

createdAt

---

# Bonus

id

clientId

appointmentId

points

reason

createdAt

---

# Article

id

title

category

content

cover

createdAt

updatedAt

---

# User

id

name

email

role

photo

createdAt

---

# Notification

id

userId

title

message

isRead

createdAt

---

# Связи

Client

↓

Appointment

↓

Procedure

↓

Payment

↓

Bonus

---

# Firebase

Firestore

users/

clients/

appointments/

procedures/

payments/

bonuses/

articles/

notifications/

---

# Storage

clients/photos/

articles/

before-after/

avatars/

documents/

---

# Правила

ID никогда не изменяется.

Удаление клиента не удаляет историю процедур.

Удаление процедуры не удаляет старые записи.

История должна сохраняться всегда.