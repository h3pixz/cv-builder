## Архитектура

- FSD: слои `app` → `views` → `widgets` → `features` → `entities` → `shared`, импорты только вниз. Подробнее: `docs/TZ.md`.
- Команда: 2 разработчика, работа в паре.
- Сейчас реально используются `app`, `widgets`, `features`, `shared`. Слоёв `views` и `entities` пока нет: композиция страниц лежит в `src/features/<name>/ui`, а файлы `src/app/**` только собирают её. Новые страницы можно класть туда же, пока `views` не выделен.
- Next.js 16 (App Router) + React 19. `params` и `searchParams` — `Promise`, их нужно `await`. В `next.config.ts` включены `cacheComponents` и `partialPrefetching`. В `AGENTS.md` предупреждение: API Next 16 отличаются от старых версий — сверяйся с `node_modules/next/dist/docs/`.

## Карта кода

Алиас `@/*` → `src/*` (см. `tsconfig.json`). Ищи готовое здесь, прежде чем писать новое.

### Маршруты и layout-ы

`src/app/`:

- `layout.tsx` — корневой layout: шрифт, `globals.css`, `Toaster`;
- `page.tsx` — заглушка главной;
- `globals.css` — Tailwind-тема;
- `(platform)/layout.tsx` — route group приложения: `Sidebar` + `AuthGate` (редирект на `/login`, если сессии нет);
- `(platform)/users/page.tsx` — список пользователей;
- `(platform)/users/[userId]/layout.tsx` — breadcrumbs и табы пользователя;
- `(platform)/users/[userId]/page.tsx` — редирект на `/profile`;
- `(platform)/users/[userId]/profile/page.tsx` — профиль пользователя.

Известные пробелы: маршрутов `/login`, `/verify-email`, `/reset-password` пока нет; ссылки сайдбара на `/skills`, `/languages`, `/cvs`, `/departments`, `/positions`, `/projects` и кнопка «плюс» на `/users/new` ведут на несуществующие страницы.

### Features

`src/features/users/` — единственная фича, задаёт структуру для новых:

- `api/users.queries.ts` — запросы (`getUsers`, `getUser`, `getCurrentProfile`, справочники);
- `api/users.mutations.ts` — CRUD пользователей, профиля, навыков и языков;
- `api/raw-request.ts` — сырой `fetch`-транспорт: логин, refresh и `authedRequest` с автообновлением токена;
- `ui/` — `users-page`, `users-table`, `users-toolbar`, `user-layout`, `user-breadcrumbs`, `user-tabs`, `profile/user-profile-page`;
- `index.ts` — публичный экспорт страницы и layout-а.

Все модули `api/` помечены `import "server-only"` — их нельзя импортировать из клиентских компонентов. `profile/avatar-upload.tsx` и `profile/user-profile-form.tsx` пока пустые заготовки.

### Widgets

- `src/widgets/sidebar/` — боковое меню (`"use client"`): collapse, активный пункт по `usePathname`.

### Shared

`src/shared/api/`:

- `graphql.ts` — `gqlRequest()` поверх `graphql-request`, добавляет `Authorization` и `Origin`;
- `session.ts` — httpOnly-cookies `access_token` / `refresh_token`, `getSession` / `saveSession` / `clearSession` / `refreshSession`;
- `errors.ts` — `ERROR_MESSAGES`, `getGraphQLErrorCode`, `getGraphQLErrorMessage`;
- `graphql/generated/` — код, сгенерированный `graphql-codegen`. Не редактировать вручную: перегенерировать из схемы;
- `index.ts` — публичный реэкспорт.

UI-kit — `src/shared/ui/<component>/`, экспорт через `index.ts`:

- `button` — `Button` (default / primary / secondary / ghost / icon);
- `input` — `Input`, `PasswordInput`, `CodeInput` (6-значный OTP);
- `textarea` — `Textarea`;
- `select` — `SelectField`, `MultiselectField`; примитивы `Select*` лежат в `select.tsx`, но из `index.ts` не реэкспортируются;
- `level` — `Level` (шкала 0–5);
- `avatar` — `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarBadge`;
- `breadcrumb` — `Breadcrumb*`;
- `dropdown-menu` — `DropdownMenu*`;
- `table` — `Table*`;
- `toast` — `Toaster`, `toast`, варианты success / error / warning / info.

`src/lib/utils.ts` только реэкспортирует `cn` из пакета `cn`. В новых файлах импортируй `cn` из `@/lib/utils`; часть UI-компонентов исторически импортирует его напрямую из `"cn"`.

`src/shared/hooks/` пока нет — создавай при первом использовании.

### Куда класть новое

- формы и пользовательские сценарии → `src/features/<name>/` (`api/` + `ui/` + `index.ts`);
- бизнес-сущности → `src/entities/` (слой ещё не создан);
- самостоятельные блоки интерфейса → `src/widgets/`;
- страницы → `src/views/` (слой ещё не создан; пока допустима композиция в `features/<name>/ui`);
- общие хуки и клиенты → `src/shared/hooks/`, `src/shared/api/`.

## GraphQL и codegen

- Схема: `schema.graphql`; полный introspection — `introspectionSchema.full.json`.
- Конфиг: `codegen.ts`. Документы ищутся в `src/features/**/*.{ts,tsx}` и `src/shared/api/*.{ts,tsx}`, результат пишется в `src/shared/api/graphql/generated/`.
- Команды: `npm run codegen`, `npm run codegen:watch`.
- Обновить схему с запущенного бэкенда: `node scripts/export-schema.mjs` (читает `VITE_GRAPHQL_URL`).
- В коде используй `graphql()` из `generated/gql` и типы из `generated/graphql`. Сырые GraphQL-строки допустимы только в `raw-request.ts`, где намеренно используется отдельный транспорт.

## Окружение и бэкенд

- `.env` (не коммитится): `VITE_GRAPHQL_URL="http://localhost:3001/api/graphql"`.
- Имя переменной — `VITE_GRAPHQL_URL` (префикс унаследован от Vite). Её читают `src/shared/api/graphql.ts`, `src/features/users/api/raw-request.ts` и `scripts/export-schema.mjs`. `NEXT_PUBLIC_` не нужен: доступ к API идёт с сервера.
- Бэкенд — отдельный репозиторий (NestJS + Apollo), контракт API и коды ошибок — `docs/BACKEND.md`.

## Конвенции

- Компоненты: именованный экспорт, `function`-декларации.
- Стили: только Tailwind; условные классы через `cn()`.
- Формы: `react-hook-form` + `zod` (зависимости уже стоят; готовых форм в коде пока нет).
- GraphQL-клиент: `graphql-request` в `src/shared/api/graphql.ts`.
- Новые варианты UI — расширять `src/shared/ui/<component>`, не стилизовать на месте.

## Скрипты и проверки

- `npm run dev` / `npm run build` / `npm start`;
- `npm run typecheck` — `tsc --noEmit`;
- `npm run lint`;
- `npm test`, `npm run test:watch`, `npm run test:coverage`.

Тесты — Vitest + React Testing Library, лежат рядом с кодом как `*.test.ts(x)`. `vitest.setup.ts` мокает `server-only`, чтобы серверные модули импортировались в unit-тестах. Цель по ТЗ — покрытие > 80% (`docs/TZ.md`); UI и сгенерированный код исключены из coverage в `vitest.config.mts`.

Текущий статус работ — `docs/PROGRESS.md`.

## Коммиты

- Conventional Commits на английском, без подписей Co-Authored-By.
- Коммитить только по просьбе; стейджить конкретные файлы; push только по явной просьбе.
- Подробный чек-лист: скилл /commit.

## Git

- Никогда `git add -A` / `git add .` — только конкретные файлы.
- Push только по явной просьбе.
