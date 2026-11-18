## Архитектура

- FSD-подход: `app` (тонкие маршруты) → `features/<domain>/{ui,api,model}` (страницы и сценарии) → `shared/{ui,api,config,helpers,hooks,types}` → `lib`; импорты только вниз. Канон структуры — `docs/STRUCTURE.md`, обоснование — `docs/TZ.md`.
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
- `(auth)/sign-in`, `(auth)/sign-up` — гостевые страницы (URL `/sign-in`, `/sign-up`);
- `(platform)/layout.tsx` — route group приватной части: `Sidebar` + `AuthGate` (редирект на `SIGN_IN_ROUTE`, если сессии нет);
- `(platform)/users/page.tsx` — список пользователей;
- `(platform)/users/[userId]/layout.tsx` — breadcrumbs и табы пользователя;
- `(platform)/users/[userId]/page.tsx` — редирект на `/profile`;
- `(platform)/users/[userId]/profile/page.tsx` — профиль пользователя.

`src/proxy.ts` — защита маршрутов: приватные требуют валидную сессию (при истёкшем access-токене обновляет пару через refresh-токен), гостевые (`GUEST_ROUTES`) отправляют авторизованного на `HOME_ROUTE`. Тесты — `src/proxy.test.ts`.

Известные пробелы: готовы только `/sign-in` и `/sign-up`; страниц `/verify-email`, `/reset-password` пока нет; ссылки сайдбара на `/skills`, `/languages`, `/cvs`, `/departments`, `/positions`, `/projects` и кнопка «плюс» на `/users/new` ведут на несуществующие страницы.

### Features

`src/features/users/` — задаёт структуру для новых фич:

- `api/users.queries.ts` — запросы (`getUsers`, `getUser`, `getCurrentProfile`, справочники);
- `api/users.mutations.ts` — CRUD пользователей, профиля, навыков и языков;
- `api/raw-request.ts` — сырой `fetch`-транспорт: логин, refresh и `authedRequest` с автообновлением токена;
- `api/profile.queries.ts` — `getCurrentUser` (id/email/role из claims access-токена: `me.id` — это id профиля, а не пользователя), `getCurrentUserRole`, навыки и языки профиля;
- `api/profile.mutations.ts` — мутации профиля, аватара и отправки письма подтверждения;
- `api/profile.actions.ts` — Server Actions профиля (`updateProfileAction`, `uploadAvatarAction`, `sendVerificationEmailAction`) с проверкой прав;
- `api/profile-levels.actions.ts` — Server Actions навыков и языков (добавление/обновление/удаление) с той же проверкой прав;
- `api/run-authed.ts` — `runAuthed`: выполнение операции с access-токеном и refresh-повтором;
- `model/` — `profile-permissions` (кто может править профиль/аватар/подтверждать email), `profile-schema` (zod), `levels` (значения Mastery/Proficiency, группировка навыков по категориям), `level-forms` (zod-схемы и сообщения для навыков/языков), `avatar` (типы и лимит 5MB), `action-result`;
- `ui/` — `users-page`, `users-table`, `users-toolbar`, `users-pagination`, `user-layout`, `user-breadcrumbs`, `user-tabs`, `profile/user-profile-page`, `profile/user-profile-form`, `profile/avatar-upload`, `profile/profile-skeleton`, `skills/user-skills-page`, `languages/user-languages-page`, `levels/level-manager` (списки, диалоги добавления/обновления/удаления), `levels/level-list-skeleton`;
- `index.ts` — публичный экспорт страницы и layout-а.

Все модули `api/` помечены `import "server-only"` — их нельзя импортировать из клиентских компонентов. Доступ к профилю: Employee правит только свой профиль и аватар и может подтвердить только свой email; Admin правит любой профиль и аватар, но подтверждение email — только владелец (`model/profile-permissions.ts`).

`src/features/auth/` — `ui/sign-in-page`, `ui/sign-up-page`, формы и `AuthTabs` в `ui/components`.

### Widgets

- `src/widgets/sidebar/` — боковое меню (`"use client"`): collapse, активный пункт по `usePathname`. Новых виджетов не добавляем (см. «Куда класть новое»).

### Shared

`src/shared/api/`:

- `graphql/client.ts` — `gqlRequest()` поверх `graphql-request`, добавляет `Authorization` и `Origin`;
- `graphql/documents` — общие документы (например, `UpdateTokenDocument`);
- `graphql/errors.ts` — `ERROR_MESSAGES`, `getGraphQLErrorCode`, `getGraphQLErrorMessage`;
- `graphql/generated/` — код, сгенерированный `graphql-codegen`. Не редактировать вручную: перегенерировать из схемы;
- `session.ts` — httpOnly-cookies `access_token` / `refresh_token`, `getSession` / `saveSession` / `clearSession` / `refreshSession`;
- `session-cookies.ts` — имена cookies, `ACCESS_TOKEN_MAX_AGE`, `REFRESH_TOKEN_MAX_AGE`, `sessionCookieOptions` (без `next/headers`, можно использовать в `proxy.ts`);
- `jwt.ts` — `isTokenExpired`;
- `index.ts` — публичный реэкспорт.

`src/shared/config/` — `env.ts` (читает `GRAPHQL_URL`), константы маршрутов `GUEST_ROUTES`, `HOME_ROUTE`, `SIGN_IN_ROUTE`.

UI-kit — `src/shared/ui/<component>/`, экспорт через `index.ts`:

- `button` — `Button` (default / primary / secondary / ghost / icon);
- `input` — `Input` (default / error), `PasswordInput`, `CodeInput` (6-значный OTP);
- `textarea` — `Textarea` (default / error);
- `select` — `SelectField` (одиночный), `MultiselectField` (мультивыбор с чипами); примитивы `Select*` лежат в `select.tsx`, но из `index.ts` не реэкспортируются;
- `level` — `Level` (шкала 0–5);
- `avatar` — `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarBadge`;
- `breadcrumb` — `Breadcrumb*`;
- `dropdown-menu` — `DropdownMenu*`;
- `table` — `Table*`;
- `toast` — `Toaster`, `toast`, варианты success / error / warning / info.

`src/lib/utils.ts` только реэкспортирует `cn` из пакета `cn`. В новых файлах импортируй `cn` из `@/lib/utils`; часть UI-компонентов исторически импортирует его напрямую из `"cn"`.

`src/shared/hooks/` пока нет — создавай при первом использовании.

### Куда класть новое

- страница и её сценарии → `src/features/<domain>/ui/`, запросы и Server Actions → `api/`, типы и схемы → `model/`, публичный экспорт → `index.ts`;
- домены: `auth`, `users`, `cvs`, `skills`, `languages`, `admin`, `settings`;
- маршрут → тонкий `src/app/<route-group>/<route>/page.tsx` (приватные — в `(platform)`, гостевые — в `(auth)`);
- `views` не выделен: композиция страниц живёт в `features/<domain>/ui`;
- `widgets` — только существующий `sidebar`; новые блоки интерфейса кладём в `features/<domain>/ui` или `shared`;
- бизнес-сущности → `src/entities/` (слой ещё не создан);
- общие функции → `src/shared/helpers/`, хуки → `src/shared/hooks/`, типы → `src/shared/types/`, конфиг → `src/shared/config/`;
- глобальное клиентское состояние → `src/store/` (Zustand).

## Готовый код страниц: `docs/PAGE_CODE.md`

- Пользователь кладёт готовую разметку/код страницы в `docs/PAGE_CODE.md` — переносить её в проект **нашими стилями и компонентами**, не копировать как есть.
- Стили: только CSS-переменные и Tailwind-тема из `src/app/globals.css` (`bg-background`, `text-foreground`, `border-border`, ...). Никаких произвольных hex/rgb из присланного кода.
- Компоненты: сначала `src/shared/ui/*`, затем готовое в `src/features/*/ui` и `src/shared`. Не хватает — добавить по структуре и переиспользовать.
- Структура: страница → `src/features/<domain>/ui/`, маршрут → тонкая обёртка в `src/app/<route-group>/<route>/page.tsx`.
- Чужие библиотеки, inline-стили и дубли компонентов из присланного кода отбрасывать.

## GraphQL и codegen

- Схема: `schema.graphql`; полный introspection — `introspectionSchema.full.json`.
- Конфиг: `codegen.ts`. Документы ищутся в `src/features/**/*.{ts,tsx}` и `src/shared/api/*.{ts,tsx}`, результат пишется в `src/shared/api/graphql/generated/`.
- Команды: `npm run codegen`, `npm run codegen:watch`.
- Обновить схему с запущенного бэкенда: `node scripts/export-schema.mjs` (адрес берёт из `.env`).
- В коде используй `graphql()` из `generated/gql` и типы из `generated/graphql`. Сырые GraphQL-строки допустимы только в `raw-request.ts`, где намеренно используется отдельный транспорт.

## Окружение и бэкенд

- `.env` (не коммитится): `GRAPHQL_URL="http://localhost:3001/api/graphql"`. Читается через `src/shared/config/env.ts`; `NEXT_PUBLIC_` не нужен: доступ к API идёт с сервера.
- Бэкенд — отдельный репозиторий `C:\projects\cv-backend` (NestJS + Apollo, GraphQL на `http://localhost:3001/api/graphql`). Контракт API, авторизация и коды ошибок — `docs/BACKEND.md`.

## Конвенции

- Компоненты: именованный экспорт, `function`-декларации.
- Стили: только Tailwind; условные классы через `cn()`.
- Формы: `react-hook-form` + `zod` (зависимости уже стоят).
- GraphQL-клиент: `graphql-request`, обёртка `gqlRequest` в `src/shared/api/graphql/client.ts`.
- Новые варианты UI — расширять `src/shared/ui/<component>`, не стилизовать на месте.

## Скрипты и проверки

- `npm run dev` / `npm run build` / `npm start`;
- `npm run typecheck` — `tsc --noEmit`;
- `npm run lint`;
- `npm test`, `npm run test:watch`, `npm run test:coverage`.

Тесты — Vitest + React Testing Library, лежат рядом с кодом как `*.test.ts(x)`. `vitest.setup.ts` мокает `server-only`, чтобы серверные модули импортировались в unit-тестах. Цель по ТЗ — покрытие > 80% (`docs/TZ.md`); UI и сгенерированный код исключены из coverage в `vitest.config.mts`.

Текущий статус работ — `docs/PROGRESS.md`.

## Коммиты

- Conventional Commits на английском, формат `type: summary` — без scope в скобках и без подписей Co-Authored-By.
- Коммитить только по просьбе; стейджить конкретные файлы; push только по явной просьбе.
- Подробный чек-лист: скилл /commit.

## Git

- Никогда `git add -A` / `git add .` — только конкретные файлы.
- Push только по явной просьбе.
