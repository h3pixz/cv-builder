# Прогресс CV Builder

Источник требований: `docs/TZ.md`. Контракт бэкенда: `docs/BACKEND.md`.

## Done

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
- [x] Описать контракт GraphQL-бэкенда: авторизация, токены, ошибки, модули API (`docs/BACKEND.md`)
- [x] Добавить карту кода для навигации по FSD-слоям (`CLAUDE.md`)
- [x] GraphQL-клиент для Server Components: `src/shared/api/graphql/client.ts` (`gqlRequest`, `GRAPHQL_URL` из `shared/config`, заголовки `Authorization` / `Origin`)
- [x] Хелпер сессии: `src/shared/api/session.ts` (httpOnly cookie `access_token` / `refresh_token`, `refreshSession` через `updateToken`)
- [x] Маппинг кодов ошибок бэкенда на русские тексты: `src/shared/api/graphql/errors.ts` (`getGraphQLErrorCode`, `getGraphQLErrorMessage`)
- [x] Привести структуру к канону: `src/features/auth` вместо `views`, route group `(auth)` с `/sign-in` и `/sign-up`, `shared/api/graphql`, `shared/config` (`docs/STRUCTURE.md`)

## In progress

- [x] Сверстать `/sign-in` по макету: табы sign in / sign up, форма на `Button` / `Input` / `PasswordInput` (`src/features/auth/ui`)
- [x] Сверстать `/sign-up` по макету: форма email + пароль + подтверждение (`src/features/auth/ui`), общие табы — `ui/components/auth-tabs.tsx`
- [x] Сверстать `/forgot-password` по макету: email + кнопка сброса + ссылка «Cancel» (`src/features/auth/ui`)
- [ ] Ветка `feat/auth-sign-in`: Server Action `login`, сохранение сессии и обработка `invalidCredentials` (вёрстка `/sign-in` готова)
- [ ] Согласовать с ментором итоговый стек: Tailwind + shadcn, Zustand, Zod + React Hook Form, отказ от Apollo Client — подтвердить формально

## Backlog

### Инфраструктура

- [ ] Middleware для защиты приватных маршрутов (редактор, список резюме)

### Маршруты и layout

- [ ] Создать общий layout: шапка, навигация, контейнер
- [ ] Настроить маршруты: список резюме, редактор, превью
- [ ] Применить SSR/SSG для страниц, где уместно

### Авторизация

- [ ] `/sign-in` — форма входа (`login`), обработка `invalidCredentials`
- [ ] `/sign-up` — Server Action `signup`, сохранение токенов до подтверждения почты (вёрстка готова)
- [ ] `/verify-email` — ввод 6-значного OTP (`verifyMail`), повторная отправка (`sendVerification`)
- [ ] `/forgot-password` — запрос письма (`forgotPassword`, вручную выставлять `Origin`)
- [ ] `/reset-password?token=...` — новый пароль (`resetPassword` с токеном из query)
- [ ] Server Action выхода: очистка cookie

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
