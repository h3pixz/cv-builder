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
- [x] UI-kit в `src/shared/ui`: `Button`, `Input` / `PasswordInput` / `CodeInput`, `Textarea`, `SelectField` / `MultiselectField`, `Checkbox`, `Label`, `Level`, `Avatar`, `Breadcrumb`, `Dialog`, `DropdownMenu`, `ListPagination`, `Table`, `Toaster` + `toast`
- [x] Настроить npm-скрипты: `typecheck`, `test`, `test:watch`, `test:coverage`
- [x] Настроить Vitest + React Testing Library + coverage (`vitest.config.mts`, `vitest.setup.ts`, тесты для `page` и `cn`)
- [x] Добавить зависимости под данные и формы: `graphql`, `graphql-request`, `zustand`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`
- [x] Поддержка тёмной темы по системной настройке (`prefers-color-scheme`, `localStorage.theme`), `Toaster` перенесён внутрь `<body>` (`src/app/layout.tsx`)

### API и сессия

- [x] Описать контракт GraphQL-бэкенда: авторизация, токены, ошибки, модули API (`docs/BACKEND.md`)
- [x] GraphQL-клиент для Server Components: `src/shared/api/graphql/graphql.ts` (`gqlRequest`, `GRAPHQL_URL` из `shared/config`, заголовки `Authorization` / `Origin`)
- [x] Хелпер сессии: `src/shared/api/session/session.ts` (httpOnly cookie `access_token` / `refresh_token`, `refreshSession` через `updateToken`)
- [x] Маппинг кодов ошибок бэкенда на английские тексты: `src/shared/api/errors/errors.ts` (`getGraphQLErrorCode`, `getGraphQLErrorMessage`)
- [x] Привести структуру к канону: `src/features/auth` вместо `views`, route group `(auth)` с `/sign-in` и `/sign-up`, `shared/api/graphql`, `shared/config` (`docs/STRUCTURE.md`)
- [x] Подключить GraphQL Code Generator: `schema.graphql` из бэкенда, `codegen.ts`, типизированные документы в `src/shared/api/graphql/generated`, скрипты `codegen` / `codegen:watch`, зависимости `@graphql-codegen/cli` / `client-preset`
- [x] `gqlRequest` принимает `TypedDocumentNode` (перегрузка сохраняет поддержку inline-строк), результат и переменные выводятся из сгенерированного документа
- [x] `refreshSession` читает `refresh_token` из cookie напрямую и использует сгенерированный документ `UpdateToken` — обновление токена не зависит от живого `access_token`; тест обновлён
- [x] Proxy (Next 16, `src/proxy.ts`): `/` и `/verify-email` приватные, `/sign-in` / `/sign-up` / `/forgot-password` уводят авторизованного на `/`; refresh по `exp` access-токена (запас 30 с) и при отсутствии access-cookie; редирект на `/sign-in?next=...` без сессии; cookie-настройки — `shared/api/session-cookies.ts`
- [x] Хелперы авторизованных запросов: `authedGqlRequest` (Server Components) и `authedGqlRequestWithRefresh` (Server Actions: refresh + один ретрай) — `shared/api/authed-request/authed-request.ts`; `protectedRequest` с редиректом при отсутствии сессии — `shared/api/protected/protected.ts`
- [x] Распознавание истёкшей сессии `isUnauthorizedError` (код `unauthorized`, `extensions.code`, 401) — `shared/api/errors/errors.ts`
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
- [x] Сверка всех 5 страниц auth с ТЗ: AC закрыты, тексты ошибок совпадают с примерами из ТЗ (`shared/api/errors/errors.ts`)
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

### Сотрудники и профиль

- [x] Список сотрудников `/users`: поиск, пагинация по 50, сортировка по имени, фамилии, отделу и должности через `searchParams`; скелетон таблицы в `Suspense` (`src/features/users/ui/users-page.tsx`)
- [x] CRUD пользователей для Admin: диалоги создания, редактирования и удаления, роли Admin / Employee, справочники departments / positions; Server Actions `users.actions.ts`, zod-схемы `model/user-schema.ts`, инвалидация `/users` и layout пользователя
- [x] Права: Employee видит список, но не управляет пользователями; Admin управляет любым профилем, Employee — только своим (`model/profile-permissions.ts`)
- [x] Профиль пользователя `/users/[userId]/profile`: имя и фамилия, email по роли, Server Actions `profile.actions.ts`
- [x] Аватар: загрузка base64 через Server Action, лимит 5MB, png / jpg / gif, `serverActions.bodySizeLimit = "8mb"`
- [x] Подтверждение email из профиля (`sendVerificationEmailAction`, только владелец профиля)
- [x] Вкладка навыков `/users/[userId]/skills`: список с Mastery и группировкой по категориям, добавление, обновление и удаление через диалоги (`levels/level-manager.tsx`)
- [x] Вкладка языков `/users/[userId]/languages`: список с Proficiency и CRUD через диалоги
- [x] Вкладка CV (только Admin): таблица с поиском и сортировкой по имени, создание, обновление и удаление CV, страница деталей `/users/[userId]/cvs/[cvId]`; Employee получает 404 (`model/cv-permissions.ts`)
- [x] Breadcrumbs и табы пользователя (`user-breadcrumbs`, `user-tabs`), редирект `/users/[userId]` → `/profile`
- [x] Общий авторизованный серверный транспорт с refresh-ретраем: `shared/api/run-authed.ts`
- [x] Тесты: права профиля и CV, схемы, сортировка и пагинация, тулбар, диалоги CV, `level-manager`, Server Actions CV

### Мержи

- [x] PR #1 `feat/auth-sign-in` → `dev` смержен 2026-11-16 (rebase, `8a6e6f3`): авторизация, сессия, proxy, codegen. Проверки перед мержем: `typecheck`, 84 теста, `build`, `codegen` без дрейфа, lint без ошибок ([PR #1](https://github.com/h3pixz/cv-builder/pull/1))
- [x] PR #2 `feat/auth-sign-in` → `dev` смержен 2026-11-17 (rebase, `bd9c993`): повторная отправка кода на `/verify-email`, inline-ошибка `accountNotFound` на `/forgot-password`, коды `accountNotFound` / `otpExpired`, лейблы полей по ТЗ, документация бэкенда. Проверки перед мержем: `typecheck`, 92 теста, `build` ([PR #2](https://github.com/h3pixz/cv-builder/pull/2))
- [x] PR #3 `docs/record-auth-pr` → `dev` смержен 2026-11-17: запись мержа auth-PR в `docs/PROGRESS.md` ([PR #3](https://github.com/h3pixz/cv-builder/pull/3))
- [x] PR #4 `feat/error-pages` → `dev` смержен 2026-11-18: страницы 404, No Internet и Device Error, общие guards и иллюстрация, тесты ([PR #4](https://github.com/h3pixz/cv-builder/pull/4))
- [x] PR #5 `feat/users-table` → `dev` смержен 2026-11-18: список сотрудников, профиль и аватар, навыки и языки, CV для Admin, права и Server Actions, скиллы `.claude`, обновление документации ([PR #5](https://github.com/h3pixz/cv-builder/pull/5))

## In progress

### Раздел CVs

Этап начат 2026-11-19. Требования — `docs/TZ.md` («Раздел CVs»), исходники — `...\cv-tz\cvs\`.

- [x] Вынести CV из `features/users` в домен `cvs` и открыть отдельный раздел `/cvs` для Admin и Employee (вкладка `/users/[userId]/cvs` осталась для Admin)
- [x] Список CV `/cvs`: таблица `Name` / `Education` / `Employee` с описанием под строкой, поиск, сортировка по имени, пагинация
- [x] Список CV: состояния loading / empty / no results / error, `CREATE CV`, меню `View` / `Edit` / `Delete`, диалоги create / update / delete по макетам
- [x] Страница CV `/cvs/[cvId]`: layout с breadcrumbs `CVs > {CV name} > {Tab}`, табы `Details` / `Skills` / `Projects` / `Preview`, возврат к списку; неавторизованный доступ к чужому CV — 404
- [x] Details: форма `Name` / `Education` / `Description`, предзаполнение, inline-валидация, `UPDATE` активна только при изменениях и без ошибок валидации, сохранение через `updateCvAction`, скелетон и ошибка `Failed to load CV details` с повтором
- [x] Тесты Details: табы и их активное состояние, предзаполнение, dirty-гейт кнопки, сохранение, inline-ошибки, сохранение значений при сбое
- [x] Skills: группировка по категориям, `ADD SKILL` из навыков владельца CV, `Update skill`, режим массового удаления; пустые категории скрыты, состояния loading (скелетон) / empty / error `Failed to load skills` с повтором
- [x] Тесты Skills: группировка и пустое состояние, фильтрация вариантов добавления, inline- и системные ошибки, обновление навыка, выбор нескольких навыков и подтверждение удаления
- [x] Projects: таблица `Name` / `Domain` / `Responsibilities` / `Start Date` / `End Date`, поиск по Name и Domain, сортировка по Name / Start Date / End Date, период «Till now»; каталог проектов (`projects`), Add / Update / Remove через диалоги, Domain / Description / Environment из каталога только для чтения, роли из активных ролей (минимум одна), даты в пределах длительности проекта; состояния loading (скелетон) / empty / no results / error `Failed to load projects` с повтором
- [x] Тесты Projects: таблица и пустое состояние, фильтрация по Name / Domain, сортировка по колонкам, автозаполнение каталога, Add / Update / Remove, inline-ошибки дат, системные ошибки без сброса значений
- [ ] Preview: резюме из профиля, языков, навыков и проектов; `Experience in Years` и `Last Used` по пересечению environment проектов CV
- [ ] `EXPORT PDF` через бэкенд `exportPdf`, имя файла из названия CV
- [ ] Права: Employee — только свои CV, Admin — любые; `notOwnCv` и прочие отказы — системной ошибкой
- [ ] Тесты: список и модалки CV, права, расчёты Experience / Last Used, Preview

## Backlog

### Маршруты и layout

- [x] Создать общий layout приватной части: сайдбар, контейнер, breadcrumbs и табы пользователя
- [x] Главная `/` перенаправляет на `/users` (стаб «Hello world» снят)
- [ ] Добавить страницы разделов из сайдбара: `/skills`, `/languages`, `/departments`, `/positions`, `/projects`
- [ ] Применить SSR/SSG для страниц, где уместно

### Авторизация — остатки

- [ ] Ручной переключатель темы (сейчас тема следует системной настройке)
- [ ] Поправить редиректы без сессии с несуществующего `/login` на `/sign-in` (`AuthGate`, `protectedRequest`)

### Резюме

- [x] Описать схему и поднять локальный GraphQL-бэкенд (`cv-backend`, Docker)
- [x] CRUD резюме сотрудника и инвалидация кэша через `revalidatePath` (вкладка CV на странице пользователя, Admin)
- [ ] Раздел CV (список, Details / Skills / Projects / Preview, PDF) — вынесен в «In progress → Раздел CVs»
- [ ] Хранить черновик резюме в Zustand (`src/store` пока не создан)

### Качество и сдача

- [ ] Адаптивная вёрстка: mobile / tablet / desktop
- [ ] Покрытие unit-тестами > 80%
- [ ] Extra: E2E-тесты ключевых сценариев (Playwright)
- [x] README: стек, зависимости, установка, запуск и тесты
- [ ] README: структура и тест-кейсы E2E
