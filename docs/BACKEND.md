# GraphQL-бэкенд CV Builder

Отдельный репозиторий, не часть фронтенда.

- **Репозиторий:** https://github.com/innowise-frontend/cv-backend.git
- **Локальная копия:** `C:\projects\cv-backend`
- **Стек:** NestJS 11 + Apollo Server 5, TypeORM + PostgreSQL 16, JWT (passport-jwt), bcrypt, nodemailer, Cloudinary, Puppeteer
- **Endpoint:** `POST http://localhost:3001/api/graphql`
- **Playground / introspection:** открыть `http://localhost:3001/api/graphql` в браузере — можно смотреть схему и дёргать запросы
- **CORS:** `origin: true`, `credentials: true`

## Запуск

1. Docker Desktop, затем в `cv-backend/docker` создать `.env.cv_backend` и `.env.cv_postgres` (шаблоны — в README бэкенда).
2. `pnpm run image:up` — поднимает Postgres (`127.0.0.1:5432`) и бэкенд (`3001`).
3. `pnpm run backup` — восстановить дамп БД.
4. Для писем (OTP, сброс пароля) нужен `SMTP_URL` с app-паролем Gmail; для аватарок — `CLOUDINARY_URL`; для PDF — `CHROME_WS` (Browserless).

Проверка: playground отвечает на `http://localhost:3001/api/graphql`.

## Переменная окружения фронтенда

README бэкенда написан под Vite (`VITE_GRAPHQL_URL`). У нас Next.js и запросы из Server Components / Server Actions, поэтому нужна серверная переменная, например:

```sh
GRAPHQL_URL="http://localhost:3001/api/graphql"
```

`NEXT_PUBLIC_` не нужен, пока весь доступ к API идёт с сервера.

## Аутентификация

### Токены

- Пара `access_token` (10 минут) + `refresh_token` (7 дней, отдельный секрет) **возвращается в теле ответа** — cookie бэкенд не выставляет.
- Передавать как `Authorization: Bearer <access_token>`.
- Обновление: мутация `updateToken`, refresh-токен тоже в заголовке `Bearer`. Возвращает новую пару.
- На бэкенде глобальный `AccessTokenGuard`: **все** query/mutation требуют access-токен, кроме помеченных `@Public` (см. ниже).

Так как токены приходят в теле, SSR-сессию делаем на своей стороне: Server Action / Route Handler сохраняет их в **httpOnly cookie**, серверные запросы подставляют заголовок. Клиент токенов не видит.

### Публичные операции

```graphql
mutation Login($auth: AuthInput!) {
  login(auth: $auth) { user { id email is_verified role } access_token refresh_token }
}

mutation Signup($auth: SignupInput!) {
  signup(auth: $auth) { user { id email is_verified role } access_token refresh_token }
}

mutation ForgotPassword($auth: ForgotPasswordInput!) {
  forgotPassword(auth: $auth)
}

mutation ResetPassword($auth: ResetPasswordInput!) {
  resetPassword(auth: $auth)   # Authorization: Bearer <токен из ссылки в письме>
}

mutation UpdateToken {
  updateToken { access_token refresh_token }   # Authorization: Bearer <refresh_token>
}
```

- `AuthInput` — `{ email, password }`
- `SignupInput` — `{ email, password, confirmPassword }`, пароль от 5 символов
- `ResetPasswordInput` — `{ newPassword, confirmPassword }`, от 6 символов
- `login` возвращает `user` целиком (включая `profile`, `department`, `position`, `cvs`)

### Подтверждение почты

После `signup` пользователь создаётся с `is_verified: false`, на email уходит 6-значный OTP (живёт 2 часа).

```graphql
mutation VerifyMail($mail: VerifyMailInput!) {
  verifyMail(mail: $mail)      # Authorization: Bearer <access_token>
}

mutation SendVerification($email: String!) {
  sendVerification(email: $email)
}
```

`verifyMail` **не публичная**: email берётся из access-токена, поэтому токены от `signup` надо сохранить до ввода OTP. Принимает только `{ otp }` ровно из 6 символов.

### Сброс пароля

1. `forgotPassword({ email })` — письмо со ссылкой `${origin}/reset-password?token=<jwt 10 мин>`.
2. На странице `/reset-password` взять `token` из query, вызвать `resetPassword` с этим токеном в `Authorization`.
3. После успеха — редирект на логин.

`origin` для ссылок бэкенд берёт из заголовка `Origin` запроса. Браузер шлёт его сам, но **`fetch` из Server Components — нет**: для `signup` и `forgotPassword` с сервера заголовок `Origin: http://localhost:3000` (или адрес приложения) нужно выставлять вручную, иначе ссылка в письме будет битой.

### Текущий пользователь

```graphql
query Me {
  me { id first_name last_name full_name avatar email is_verified role }
}
```

`me` живёт в модуле `profile` и возвращает `Profile`. Отдельного `me` в `users` нет; `user(userId)` требует id. `id` пользователя из ответа `login`/`signup` можно хранить в сессии.

### Ошибки

Apollo отдаёт `errors[].message` — это код на английском (camelCase), его нужно маппить на русские тексты в UI. `extensions.code` — HTTP-статус (`UNAUTHORIZED`, `BAD_REQUEST`, `CONFLICT`, `FORBIDDEN`, `SERVICE_UNAVAILABLE`, `INTERNAL_SERVER_ERROR`).

Коды, которые встретятся на страницах авторизации:

| Код | Где | Смысл |
|---|---|---|
| `invalidCredentials` | login | Неверная почта или пароль |
| `userAlreadyExists` | signup | Почта уже занята |
| `confirmPasswordMismatch` | signup, resetPassword | Пароли не совпадают |
| `passwordTooShort`, `confirmPasswordTooShort` | signup, resetPassword | Слишком короткий пароль |
| `passwordIsRequired` | login | Пустой пароль |
| `invalidEmail` | везде | Некорректная почта |
| `otpIsRequired`, `shouldBe6Digits` | verifyMail | Неверный формат OTP |
| `mailNotFound` | verifyMail | Неверный или устаревший OTP |
| `actionExpired` | resetPassword | Ссылка сброса истекла |
| `failedToSendEmail` | signup, forgotPassword | Не удалось отправить письмо (и «почта не найдена» при сбросе) |
| `unauthorized` | любые защищённые операции | Нет/просрочен access-токен |
| `invalidRefreshToken` | updateToken | Нужен повторный вход |
| `insufficientPermissions` | админские операции | Не хватает роли |

## Пользователи и роли

```graphql
enum UserRole { Employee Admin }

type User {
  id: ID!
  created_at: String!
  email: String!
  is_verified: Boolean!
  profile: Profile!
  role: UserRole!
  department: Department
  position: Position
  cvs: [Cv!]
}
```

Роль по умолчанию — `Employee`. Создание/удаление пользователей и смена ролей — только `Admin`.

## Модули API

| Модуль | Что даёт |
|---|---|
| `auth` | login, signup, forgotPassword, resetPassword, updateToken |
| `users` | `users` (пагинация), `user(id)`, changePassword, CRUD пользователей (admin) |
| `profile` | `me`, `profile(userId)`, updateProfile, uploadAvatar/deleteAvatar |
| `cvs` | CRUD резюме, `cvs`, `cvsByUserId`, `cv(id)`; PDF-экспорт |
| `cvs` / `pdf` | `exportPdf({ html, margin })` → base64-строка PDF |
| `cv_skills`, `cv_projects` | навыки и проекты внутри резюме |
| `departments`, `positions` | справочники |
| `languages`, `skills`, `skill_categories`, `projects` | справочники/CRUD |
| `mail` | verifyMail, sendVerification |
| `cloud` | загрузка аватарок в Cloudinary (внутренний модуль) |

Схема: все `src/**/*.graphql` в репозитории бэкенда; единого `schema.graphql` нет — удобнее всего смотреть через Playground/introspection.

## Что это значит для страницы авторизации

Фронтенду нужны маршруты, на которые бэкенд ссылается из писем:

- `/verify-email` — ввод 6-значного OTP; доступен только с валидным access-токеном (сохранить после `signup`).
- `/reset-password?token=...` — новый пароль, токен из query уходит в `Authorization`.

Рекомендуемая схема сессии: токены в httpOnly cookie, `updateToken` на сервере при истечении access-токена (через ~10 минут), middleware для защиты редактора. Подробный план по слоям FSD — в обсуждении задачи.
