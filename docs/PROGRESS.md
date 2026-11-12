# Прогресс CV Builder

Источник требований: `docs/TZ.md`. Контракт бэкенда: `docs/BACKEND.md`.

## Done

### Инфраструктура и UI-kit

- [x] Инициализировать Next.js (App Router) + TypeScript
- [x] Настроить ESLint и алиас `@/*`
- [x] Добавить корневой `layout.tsx` и стартовую `page.tsx`
- [x] Зафиксировать архитектуру FSD (`src/app` → `views` → `widgets` → `features` → `entities` → `shared`)
- [x] Отказаться от Apollo Client в пользу Server Components + `fetch` / Server Actions (решение зафиксировано в `docs/TZ.md`)
- [x] Подключить Tailwind CSS + shadcn (`components.json`, `globals.css`, PostCSS)
- [x] UI-kit в `src/shared/ui`: `Button`, `Input`, `Textarea`, `SelectField` / `MultiselectField`, `Level`, `Toaster` + `toast`
- [x] Настроить npm-скрипты: `typecheck`, `test`, `test:watch`, `test:coverage`
- [x] Настроить Vitest + React Testing Library + coverage (`vitest.config.mts`, `vitest.setup.ts`, тесты для `page` и `cn`)
- [x] Добавить зависимости под данные и формы: `graphql`, `graphql-request`, `zustand`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`
- [x] Поддержка тёмной темы по системной настройке (`prefers-color-scheme`, `localStorage.theme`), `Toaster` перенесён внутрь `<body>` (`src/app/layout.tsx`)

### API и сессия

- [x] Описать контракт GraphQL-бэкенда: авторизация, токены, ошибки, модули API (`docs/BACKEND.md`)
- [x] GraphQL-клиент для Server Components: `src/shared/api/graphql/client.ts` (`gqlRequest`, `GRAPHQL_URL` из `shared/config`, заголовки `Authorization` / `Origin`)
- [x] Хелпер сессии: `src/shared/api/session.ts` (httpOnly cookie `access_token` / `refresh_token`, `refreshSession` через `updateToken`)
- [x] Маппинг кодов ошибок бэкенда на английские тексты: `src/shared/api/graphql/errors.ts` (`getGraphQLErrorCode`, `getGraphQLErrorMessage`)
- [x] Привести структуру к канону: `src/features/auth` вместо `views`, route group `(auth)` с `/sign-in` и `/sign-up`, `shared/api/graphql`, `shared/config` (`docs/STRUCTURE.md`)

### Страницы авторизации

- [x] Сверстать `/sign-in` по макету: табы sign in / sign up, форма на `Button` / `Input` / `PasswordInput` (`src/features/auth/ui`)
- [x] `/sign-in` — клиентская валидация (Zod + React Hook Form, `model/sign-in-schema.ts`): inline-сообщения, error-состояния полей, кнопка `disabled` до валидности, тоггл пароля доступен с клавиатуры
- [x] Сверстать `/sign-up` по макету: email + пароль + подтверждение, общие табы — `ui/components/auth-tabs.tsx`
- [x] `/sign-up` — клиентская валидация (`model/sign-up-schema.ts`): email, пароль от 6 символов, совпадение подтверждения, inline-ошибки, disabled-кнопка
- [x] Сверстать `/forgot-password` по макету: email + кнопка сброса + ссылка «Cancel»
- [x] `/forgot-password` — inline-валидация email (`model/forgot-password-schema.ts`) поверх Server Action `forgotPassword` (`api/forgot-password.ts`), `Origin` из заголовков запроса, тосты успеха/ошибки
- [x] Сверстать `/reset-password` по макету: новый пароль + подтверждение, `PasswordInput`, кнопка «Submit» и ссылка «Go to sign in»
- [x] `/reset-password` — клиентская валидация (`model/reset-password-schema.ts`): пароль от 6 символов, совпадение подтверждения, inline-ошибки
- [x] Сверстать `/verify-email` по макету: OTP на `CodeInput`, кнопка «Confirm», ссылка «Later»
- [x] `/verify-email` — клиентская валидация кода (required / ровно 6 цифр) с inline-ошибкой; «Later» ведёт на главную `/`
- [x] Общие Zod-схемы для auth-форм: `model/validation.ts` (`emailSchema`, `passwordSchema`)
- [x] `PasswordInput` — disabled-состояние тоггла; `CodeInput` — адаптивные отступы на узких экранах

## In progress

- [ ] Ветка `feat/auth-sign-in`: Server Action `login`, сохранение сессии и обработка `invalidCredentials` (вёрстка и валидация `/sign-in` готовы)
- [ ] Согласовать с ментором итоговый стек: Tailwind + shadcn, Zustand, Zod + React Hook Form, отказ от Apollo Client — подтвердить формально

## Backlog

### Инфраструктура

- [ ] Middleware для защиты приватных маршрутов (редактор, список резюме)

### Маршруты и layout

- [ ] Создать общий layout: шапка, навигация, контейнер
- [ ] Настроить маршруты: список резюме, редактор, превью
- [ ] Применить SSR/SSG для страниц, где уместно

### Авторизация — остаётся на бэкенд-интеграцию

- [ ] `/sign-in` — Server Action `login`, сохранение сессии, обработка `invalidCredentials`, показ серверной ошибки (AC-9, AC-10), loading-состояние кнопки
- [ ] `/sign-up` — Server Action `signup`, сохранение токенов до подтверждения почты, обработка `userAlreadyExists` / `confirmPasswordMismatch`, редирект на `/verify-email`, loading-состояние
- [ ] `/verify-email` — мутация `verifyMail` (активация аккаунта), обработка `mailNotFound` / `otpIsRequired` / `shouldBe6Digits`, повторная отправка через `sendVerification`, редирект на главную после успеха, loading-состояние
- [ ] `/reset-password?token=...` — чтение токена из query, мутация `resetPassword` с токеном в `Authorization`, обработка `actionExpired` / `confirmPasswordMismatch`; уточнить с бэкендом авто-вход после сброса (в `docs/BACKEND.md` описан редирект на логин)
- [ ] `/forgot-password` — обработать кейс «почта не найдена» (`failedToSendEmail`) отдельным сообщением, если бэкенд различает
- [ ] Server Action выхода: очистка cookie
- [ ] Общий компонент/место для form-level серверных ошибок (inline под формой + тост) и блокировка полей во время запроса
- [ ] Проверка валидной сессии у `/verify-email` (доступ только после регистрации)
- [ ] Ручной переключатель темы (сейчас тема следует системной настройке)

### Резюме

- [ ] Описать схему и поднять локальный GraphQL-бэкенд (`cv-backend`, Docker)
- [ ] Реализовать CRUD-запросы резюме (Server Components / Server Actions) и инвалидацию кэша (`revalidateTag` / `revalidatePath`)
- [ ] Хранить черновик резюме в Zustand
- [ ] Форма личных данных и контактов
- [ ] Форма опыта работы
- [ ] Форма образования и навыков
- [ ] Валидация полей формы (Zod + React Hook Form)
- [ ] Живое превью резюме (`src/widgets`)
- [ ] Сохранение и загрузка резюме через API

### Качество и сдача

- [ ] Адаптивная вёрстка: mobile / tablet / desktop
- [ ] Unit-тесты компонентов и стора, покрытие > 80%
- [ ] Extra: E2E-тесты ключевых сценариев (Playwright)
- [ ] README: функционал, зависимости, установка, запуск тестов
- [ ] README: структура и тест-кейсы E2E
