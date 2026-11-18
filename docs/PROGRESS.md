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
- [x] Подключить GraphQL Code Generator: `schema.graphql` из бэкенда, `codegen.ts`, типизированные документы в `src/shared/api/graphql/generated`, скрипты `codegen` / `codegen:watch`, зависимости `@graphql-codegen/cli` / `client-preset`
- [x] `gqlRequest` принимает `TypedDocumentNode` (перегрузка сохраняет поддержку inline-строк), результат и переменные выводятся из сгенерированного документа
- [x] `refreshSession` читает `refresh_token` из cookie напрямую и использует сгенерированный документ `UpdateToken` — обновление токена не зависит от живого `access_token`; тест обновлён
- [x] Proxy (Next 16, `src/proxy.ts`): `/` и `/verify-email` приватные, `/sign-in` / `/sign-up` / `/forgot-password` уводят авторизованного на `/`; refresh по `exp` access-токена (запас 30 с) и при отсутствии access-cookie; редирект на `/sign-in?next=...` без сессии; cookie-настройки — `shared/api/session-cookies.ts`
- [x] Хелперы авторизованных запросов: `authedGqlRequest` (Server Components) и `authedGqlRequestWithRefresh` (Server Actions: refresh + один ретрай) — `shared/api/graphql/authed-request.ts`
- [x] Распознавание истёкшей сессии `isUnauthorizedError` (код `unauthorized`, `extensions.code`, 401) — `shared/api/graphql/errors.ts`
- [x] Константы маршрутов (`shared/config/routes.ts`) и безопасный `next` без внешних редиректов (`shared/helpers/redirect-path.ts`)
- [x] `login` запрашивает `user { is_verified }`: неподтверждённых ведёт на `/verify-email`, остальных — на `next` или `/`; `next` прокинут из `/sign-in` через страницу и форму
- [x] Codegen сканирует `shared/api/**` — документ `UpdateToken` остаётся в сгенерированных типах
- [x] Тесты: proxy (просроченный токен, `next`, гостевые маршруты), `login`, `authedGqlRequest*`, `isUnauthorizedError`, `isTokenExpired`, `safeRedirectPath`
- [x] Отправка писем: Gmail SMTP с app password (`docker/.env.cv_backend`), доставка на реальную почту проверена; локальная альтернатива — Mailpit (`smtp://mailpit:1025`, UI `http://localhost:8025`)

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
- [x] Типизированные GraphQL-документы auth-операций (`Login`, `Signup`, `ForgotPassword`, `ResetPassword`, `VerifyMail`) — `src/features/auth/api/documents.ts`
- [x] `/sign-in` — Server Action `login`: сохранение сессии, inline-ошибка + тост `invalidCredentials`, disabled/loading кнопки
- [x] `/sign-up` — Server Action `signup`: `Origin` для ссылки в письме, сохранение токенов, `userAlreadyExists` inline на поле email, редирект на `/verify-email`
- [x] `/verify-email` — проверка сессии перед рендером, `verifyMail` с access-токеном и refresh-ретраем при `unauthorized`, ошибки `mailNotFound` / `shouldBe6Digits` / истёкшая сессия, редирект на `/`
- [x] `/verify-email` — повторная отправка кода: Server Action `resendVerification` (`sendVerification` с access-токеном и refresh-ретраем, email из токена), кнопка «Send again», тосты успеха/ошибки
- [x] `/reset-password?token=...` — чтение `token` из query, `resetPassword` с токеном в `Authorization`, ошибки `actionExpired` / `confirmPasswordMismatch`, сообщение для отсутствующего токена
- [x] Авто-вход после сброса пароля: email берётся из payload reset-токена, затем `login` с новым паролем; при сбое — редирект на `/sign-in`
- [x] Общие `FormError` (form-level ошибки) и `AuthLink` (ссылки с `focus-visible`) для auth-форм
- [x] Next 16: auth-маршруты с `cookies` / `searchParams` помечены `instant = false` (blocking prerender)
- [x] Тесты auth-форм (Vitest + RTL): `sign-in`, `sign-up`, `verify-email`, `forgot-password`, `reset-password` — валидация, disabled-состояния, вызовы Server Actions, тосты, ссылки-переходы
- [x] Server Action выхода `logout` — очистка cookie и редирект на `/sign-in`
- [x] Сверка всех 5 страниц auth с ТЗ: AC закрыты, тексты ошибок совпадают с примерами из ТЗ (`shared/api/graphql/errors.ts`)
- [x] `/forgot-password` — отдельное сообщение «No account found with this email address»: код `accountNotFound` + inline-ошибка формы (`FormError`)
- [x] `/verify-email` — срок жизни OTP 2 часа: код `otpExpired` → «Verification code has expired»; повторная отправка перевыпускает код и обновляет время выпуска
- [x] Плейсхолдеры и доступные лейблы полей приведены к названиям из ТЗ (`Confirm Password`, `New Password`)
- [x] Локальный патч учебного бэкенда (`C:\projects\cv-backend`, в upstream не пушился): `forgotPassword` → `accountNotFound`, `verifyMail` → проверка TTL 2 часа и `otpExpired`, `SignupDto` → пароль от 6 символов. При пересборке бэкенда из чистого upstream патч нужно накатить повторно (см. `docs/BACKEND.md`)

### Страницы ошибок

- [x] No Internet: страница «Oops» с иллюстрацией и кнопкой `RETRY` (`src/features/errors/ui/no-internet-page.tsx`), тексты по ТЗ, `Button variant="primary"`
- [x] Подключение: `src/app/error.tsx` (`retry`), `src/app/global-error.tsx` (собственные `html`/`body` + `globals.css` + тема), офлайн-оверлей `OfflineGuard` в root layout (`navigator.onLine` + события `online`/`offline`)
- [x] Общие требования для No Internet: Light/Dark темы, клавиатура и focus-visible, центрирование, адаптивность
- [x] Тесты: `useOnlineStatus`, `NoInternetPage`, `OfflineGuard`, `app/error`, `app/global-error`
- [x] Not Found (404): страница «Hmm…» с общей иллюстрацией `SadMonitorIllustration`, текстом по ТЗ и кнопкой `GO BACK` (`src/features/errors/ui/not-found-page.tsx`), `Button variant="primary"`
- [x] Подключение Not Found: `src/app/not-found.tsx` (корневой `not-found` ловит несуществующие URL), возврат назад с фолбэком на `/` — `shared/helpers/go-back.ts`
- [x] Тесты Not Found: `NotFoundPage`, `goBack`, `app/not-found`
- [x] Device Error: страница «Oops» с иллюстрацией и текстом по ТЗ (`src/features/errors/ui/device-error-page.tsx`)
- [x] Показ при ширине вьюпорта меньше `768px`, включая ресайз: `useMediaQuery` (`shared/hooks`) + `DeviceGuard` в root layout, контент под оверлеем `inert`
- [x] Общие требования для Device Error: Light/Dark темы, центрирование, адаптивность
- [x] Тесты Device Error: `useMediaQuery`, `DeviceErrorPage`, `DeviceGuard`

### Мержи

- [x] PR #1 `feat/auth-sign-in` → `dev` смержен 2026-11-16 (rebase, `8a6e6f3`): авторизация, сессия, proxy, codegen. Проверки перед мержем: `typecheck`, 84 теста, `build`, `codegen` без дрейфа, lint без ошибок ([PR #1](https://github.com/h3pixz/cv-builder/pull/1))
- [x] PR #2 `feat/auth-sign-in` → `dev` смержен 2026-11-17 (rebase, `bd9c993`): повторная отправка кода на `/verify-email`, inline-ошибка `accountNotFound` на `/forgot-password`, коды `accountNotFound` / `otpExpired`, лейблы полей по ТЗ, документация бэкенда. Проверки перед мержем: `typecheck`, 92 теста, `build` ([PR #2](https://github.com/h3pixz/cv-builder/pull/2))

## In progress

## Backlog

### Маршруты и layout

- [ ] Создать общий layout: шапка, навигация, контейнер
- [ ] Настроить маршруты: список резюме, редактор, превью
- [ ] Применить SSR/SSG для страниц, где уместно

### Авторизация — остатки

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
