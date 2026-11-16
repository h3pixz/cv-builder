# Прогресс CV Builder

Источник требований: `docs/TZ.md`. Статус ниже соответствует коду в репозитории.

## Done

- [x] Инициализировать Next.js 16 (App Router) + TypeScript + React 19
- [x] Настроить ESLint, alias `@/*`, Tailwind CSS 4
- [x] Корневой `layout.tsx`, `Toaster`, `globals.css`
- [x] UI-kit в `src/shared/ui`: button, input (`Input` / `PasswordInput` / `CodeInput`), textarea, select (`SelectField` / `MultiselectField`), level, avatar, breadcrumb, dropdown-menu, table, toast
- [x] Vitest + React Testing Library + coverage; `vitest.setup.ts` мокает `server-only`
- [x] GraphQL-слой: `graphql-request` (`gqlRequest`), `graphql-codegen` (`codegen.ts`), `schema.graphql`, скрипт экспорта схемы
- [x] Сессия в httpOnly-cookie: `getSession` / `saveSession` / `clearSession` / `refreshSession`
- [x] Маппинг кодов ошибок GraphQL на русские тексты
- [x] Документация контракта бэкенда (`docs/BACKEND.md`)
- [x] Route group `(platform)`: сайдбар и `AuthGate` с редиректом на `/login`
- [x] Сайдбар с collapse и подсветкой активного пункта
- [x] Список пользователей: таблица, поиск через `searchParams`, переход в профиль
- [x] Layout пользователя: breadcrumbs, табы, редирект `/users/[id]` → `/profile`
- [x] Страница профиля пользователя (read-only)
- [x] API-запросы и мутации пользователей, профиля, навыков, языков; `authedRequest` с авто-обновлением токена

## In progress

- [ ] Форма редактирования профиля — `profile/user-profile-form.tsx` пока пустой файл-заготовка
- [ ] Загрузка/удаление аватара — `profile/avatar-upload.tsx` пока пустой файл-заготовка
- [ ] Страницы авторизации: `/login`, `/verify-email`, `/reset-password`

## Backlog

- [ ] Разделы пользователя `skills`, `languages`, `cvs` (табы уже ссылаются на них)
- [ ] CRUD пользователей в UI: создание (`/users/new`), редактирование, удаление, смена роли
- [ ] Смена пароля через UI
- [ ] Разделы `departments`, `positions`, `projects`, `skills`, `languages` (пункты сайдбара пока ведут на несуществующие маршруты)
- [ ] Формы резюме: личные данные, опыт, образование, навыки
- [ ] Живое превью резюме и PDF-экспорт
- [ ] Адаптивная вёрстка: mobile / tablet / desktop
- [ ] Покрытие unit-тестами > 80%
- [ ] Extra: E2E-тесты ключевых сценариев (Playwright)
