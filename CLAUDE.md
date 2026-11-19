## Архитектура

- FSD-подход: `app` (тонкие маршруты) → `features/<domain>/{ui,api,model}` (страницы и сценарии) → `shared/{ui,api,config,helpers,hooks,types}` → `lib`; импорты только вниз. Канон структуры — `docs/STRUCTURE.md`, обоснование — `docs/TZ.md`.
- Команда: 2 разработчика, работа в паре.
- Сейчас реально используются `app`, `widgets`, `features`, `shared`. Слоёв `views`, `entities`, `store` пока нет: композиция страниц лежит в `src/features/<name>/ui`, а файлы `src/app/**` только собирают её. Новые страницы можно класть туда же, пока `views` не выделен.
- Домены фич: `auth`, `users`, `cvs`, `errors`. Навыки и языки пока живут внутри `users` (`users/ui/skills`, `users/ui/languages`), отдельных фич `skills` / `languages` нет.
- Next.js 16 (App Router) + React 19. `params` и `searchParams` — `Promise`, их нужно `await`. В `next.config.ts` включены `cacheComponents` и `partialPrefetching`.
- Компоненты, читающие `params`, `searchParams`, `cookies()` или `headers()`, обёрнуты в `<Suspense>` в файлах маршрутов — иначе Next 16 падает с blocking-prerender.
- `experimental.serverActions.bodySizeLimit = "8mb"` — аватар уходит в Server Action как base64 (файл до 5MB).
- В `AGENTS.md` предупреждение: API Next 16 отличаются от старых версий — сверяйся с `node_modules/next/dist/docs/`.

## Карта кода

Алиас `@/*` → `src/*` (см. `tsconfig.json`). Ищи готовое здесь, прежде чем писать новое.

### Маршруты и layout-ы

`src/app/`:

- `layout.tsx` — корневой layout: шрифт Roboto, `globals.css`, `THEME_SCRIPT` (тема до гидрации), `DeviceGuard` + `OfflineGuard`, `Toaster`;
- `page.tsx` — заглушка главной;
- `globals.css` — Tailwind-тема;
- `error.tsx` — глобальная ошибка с `RETRY` (рендерит `NoInternetPage`), `global-error.tsx` — собственные `html`/`body`, `not-found.tsx` — страница 404 (`NotFoundPage`);
- `(auth)/sign-in`, `(auth)/sign-up`, `(auth)/forgot-password`, `(auth)/reset-password`, `(auth)/verify-email` — гостевые страницы (URL без префикса группы);
- `(platform)/layout.tsx` — route group приватной части: `Sidebar` + `AuthGate` внутри `Suspense` (редирект, если сессии нет);
- `(platform)/users/page.tsx` — список сотрудников, читает `search`, `page`, `sort_by`, `sort_order`;
- `(platform)/users/[userId]/layout.tsx` — breadcrumbs и табы пользователя;
- `(platform)/users/[userId]/page.tsx` — редирект на `/profile`;
- `(platform)/users/[userId]/profile/page.tsx` — профиль пользователя;
- `(platform)/users/[userId]/skills/page.tsx` — навыки пользователя;
- `(platform)/users/[userId]/languages/page.tsx` — языки пользователя;
- `(platform)/users/[userId]/cvs/page.tsx` — вкладка CV сотрудника (только Admin), читает `search`, `sort_by`, `sort_order`;
- `(platform)/users/[userId]/cvs/[cvId]/page.tsx` — редирект на `/cvs/[cvId]/details`;
- `(platform)/cvs/page.tsx` — раздел CV для Admin и Employee, читает `search`, `page`, `sort_by`, `sort_order`;
- локальные `error.tsx` — у `/users`, `/cvs`, `/users/[userId]/cvs`, `/users/[userId]/skills`, `/users/[userId]/languages`.

`src/proxy.ts` — защита маршрутов: приватные требуют валидную сессию (при истёкшем access-токене обновляет пару через refresh-токен), гостевые (`GUEST_ROUTES`: `/sign-in`, `/sign-up`, `/forgot-password`) отправляют авторизованного на `HOME_ROUTE`. Matcher — все страницы приложения, кроме API и статики (`api`, `_next`, картинки/иконки), поэтому новые маршруты защищены по умолчанию. Тесты — `src/proxy.test.ts`.

Известные пробелы:

- страниц `/skills`, `/languages`, `/departments`, `/positions`, `/projects`, на которые ведут ссылки сайдбара, пока нет;
- серверная проверка сессии в `(platform)/layout.tsx` (`AuthGate`) и `protectedRequest` редиректят на `/login`, хотя реальный маршрут входа — `/sign-in`; это известный баг, требующий правки кода;
- `scripts/export-schema.mjs`, на который ссылаются старые инструкции, в репозитории отсутствует (папки `scripts/` нет).

### Features

`src/features/auth/`:

- `ui/` — `sign-in-page`, `sign-up-page`, `forgot-password-page`, `reset-password-page`, `verify-email-page`; формы и общие `AuthTabs`, `AuthLink`, `FormError` — в `ui/components`;
- `api/` — Server Actions `login`, `signup`, `logout`, `forgotPassword`, `resetPassword`, `verifyEmail`, `resendVerification`; типизированные документы — `documents.ts`, email из reset-токена — `token-payload.ts`, маппинг ошибок формы — `action-result.ts`;
- `model/` — zod-схемы форм (`sign-in`, `sign-up`, `forgot-password`, `reset-password`) и общие `emailSchema` / `passwordSchema` в `validation.ts`;
- `index.ts` — публичный экспорт страниц.

`src/features/errors/`:

- `ui/no-internet-page.tsx` — экран «Oops» с `RETRY`;
- `ui/not-found-page.tsx` — 404 «Hmm…» с `GO BACK`;
- `ui/device-error-page.tsx` — неподдерживаемое устройство (< 768px);
- `ui/offline-guard.tsx` — оверлей при `navigator.onLine === false`, `ui/device-guard.tsx` — оверлей на узком вьюпорте (контент под ним `inert`);
- `ui/sad-monitor-illustration.tsx` — общая иллюстрация.

`src/features/users/` — задаёт структуру для новых фич:

- `api/users.queries.ts` — `getUsers`, `getUser`, справочники `getDepartmentOptions` / `getPositionOptions` (обёрнуты в `cache`);
- `api/users.mutations.ts` — CRUD пользователей и `changeUserPassword`;
- `api/users.actions.ts` — Server Actions пользователей (`createUserAction`, `updateUserAction`, `deleteUserAction`) с валидацией и `revalidatePath`;
- `api/profile.queries.ts` — `getCurrentProfile`, `getCurrentUserRole`, `getUserSkills`, `getUserLanguages`, справочники навыков/категорий/языков; текущий пользователь (`getCurrentUser`) — в `shared/api/current-user.ts`;
- `api/profile.mutations.ts` — мутации профиля, аватара, отправки письма подтверждения, навыков и языков;
- `api/profile.actions.ts` — Server Actions профиля (`updateProfileAction`, `uploadAvatarAction`, `sendVerificationEmailAction`) с проверкой прав;
- `api/profile-levels.actions.ts` — Server Actions навыков и языков (добавление/обновление/удаление);
- `api/profile-revalidate.ts` — `revalidateUser` (список `/users` и layout всех вкладок пользователя);
- `model/` — `action-result` (`AvatarUploadResult`), `user-schema` (zod, create/update), `user-record`, `profile-schema` (zod), `profile-permissions`, `avatar` (типы и лимит 5MB), `level-forms` (zod-схемы и сообщения для навыков/языков), `cv-permissions` (видимость вкладки CV);
- `ui/` — `users-page`, `users-header`, `users-toolbar`, `users-table`, `users-pagination`, диалоги `create-user-dialog` / `update-user-dialog` / `delete-user-dialog`; `user-layout`, `user-breadcrumbs`, `user-tabs`, `user-current-page`; `profile/user-profile-page`, `profile/user-profile-form`, `profile/avatar-upload`, `profile/profile-skeleton`; `skills/user-skills-page`, `languages/user-languages-page`, `levels/level-manager` (списки и диалоги добавления/обновления/удаления), `levels/level-list-skeleton`;
- `index.ts` — публичный экспорт страниц и layout-а.

`src/features/cvs/`:

- `api/cvs.queries.ts` — `getCvs` (все CV, поиск/пагинация), `getCvsByUserId` (вкладка пользователя), `getCv` / `getCvContext` (CV с проверкой доступа), справочники ролей, проектов и категорий навыков;
- `api/cvs.mutations.ts` — create / update / delete CV;
- `api/cvs.actions.ts` — Server Actions CV (`createCvAction` / `updateCvAction` / `deleteCvAction`);
- `api/cv-skills.actions.ts`, `api/cv-projects.actions.ts` — Server Actions навыков и проектов внутри CV;
- `model/` — `cv-record`, `cv-schema` (zod), `cv-permissions` (`canAccessCv`: Employee — только свои CV, Admin — любые), `cv-skill-schema`, `cv-project-schema`, `cv-tabs`;
- `ui/` — `cvs-page`, `cvs-header`, `cvs-toolbar`, `cvs-table`, `cvs-sort-header`, `cvs-pagination`, `cvs-table-skeleton`, `cv-actions-menu`, `cv-dialog`, `delete-cv-dialog`, `user-cvs-page` (вкладка в `/users/[userId]/cvs`);
- `index.ts` — публичный экспорт страниц.

Все модули `api/` помечены `import "server-only"` — их нельзя импортировать из клиентских компонентов. Доступ:

- Admin управляет пользователями (создание, редактирование, удаление) и любыми профилями и аватарами; Employee видит список, но не управляет пользователями;
- Employee правит только свой профиль и аватар, собственные навыки и языки; подтверждение email — только владелец (`model/profile-permissions.ts`);
- вкладка CV в профиле пользователя доступна только Admin (`model/cv-permissions.ts`); Employee при прямом заходе получает 404;
- раздел `/cvs` доступен Admin и Employee: Employee видит и меняет только свои CV, Admin — любые (`cvs/model/cv-permissions.ts`); отказ бэкенда `notOwnCv` показывается как системная ошибка.

### Widgets

- `src/widgets/sidebar/` — боковое меню (`"use client"`): collapse, активный пункт по `usePathname`, ссылки на Employees / Skills / Languages / CVs и Departments / Positions / Projects. Новых виджетов не добавляем (см. «Куда класть новое»).

### Shared

`src/shared/api/`:

- `graphql/graphql.ts` — `gqlRequest()` поверх `graphql-request`, добавляет `Authorization` и `Origin`;
- `graphql/generated/` — код, сгенерированный `graphql-codegen`. Не редактировать вручную: перегенерировать из схемы;
- `authed-request/authed-request.ts` — `authedGqlRequest` (Server Components) и `authedGqlRequestWithRefresh` (refresh + один ретрай);
- `protected/protected.ts` — `protectedRequest`: проверка сессии и редирект для серверных запросов;
- `documents/documents.ts` — общие документы (например, `UpdateTokenDocument`);
- `errors/errors.ts` — `ERROR_MESSAGES`, `getGraphQLErrorCode`, `getGraphQLErrorMessage`, `isUnauthorizedError`;
- `session/session.ts` — httpOnly-cookies `access_token` / `refresh_token`, `getSession` / `saveSession` / `clearSession` / `refreshSession`;
- `session-cookies/session-cookies.ts` — имена cookies, `ACCESS_TOKEN_MAX_AGE`, `REFRESH_TOKEN_MAX_AGE`, `ACCESS_TOKEN_REFRESH_SKEW`, `sessionCookieOptions` (без `next/headers`, можно использовать в `proxy.ts`);
- `jwt/jwt.ts` — `getTokenPayload`, `getTokenSubject`, `isTokenExpired`;
- `action-result.ts` — общий `ActionResult` и `toActionError`;
- `current-user.ts` — `getCurrentUser` / `SessionUser` (id/email/role из claims access-токена; `me.id` — это id профиля, а не пользователя);
- `run-authed.ts` — `runAuthed`: операция с access-токеном и refresh-повтором, `unauthorizedFailure` / `forbiddenFailure`;
- `request-origin.ts` — `getRequestOrigin` (публичный origin запроса для ссылок в письмах);
- `index.ts` — публичный реэкспорт.

`src/shared/config/` — `env.ts` (`getGraphQLUrl` читает `GRAPHQL_URL`), `routes.ts` (константы `HOME_ROUTE`, `SIGN_IN_ROUTE`, `SIGN_UP_ROUTE`, `FORGOT_PASSWORD_ROUTE`, `VERIFY_EMAIL_ROUTE`, `GUEST_ROUTES`), `theme-script.ts` (`THEME_SCRIPT` для темы до гидрации), `index.ts`.

`src/shared/helpers/` — `redirect-path.ts` (`safeRedirectPath`), `date-formatter.ts`, `go-back.ts`, `reload-page.ts`, `levels.ts` (значения Mastery/Proficiency, группировка навыков), `index.ts`.

`src/shared/hooks/` — `use-media-query.ts`, `use-online-status.ts`.

`src/shared/types/` — `user-role.ts` (`USER_ROLES`, `UserRoleValue`).

UI-kit — `src/shared/ui/<component>/`, экспорт через `index.ts`:

- `button` — `Button` (default / primary / secondary / ghost / icon), `buttonVariants`;
- `input` — `Input` (default / error), `PasswordInput`, `CodeInput` (6-значный OTP);
- `textarea` — `Textarea` (default / error);
- `select` — `SelectField`, `MultiselectField`, тип `SelectOption`; примитивы `Select*` лежат в `select.tsx`, но из `index.ts` не реэкспортируются;
- `checkbox` — `Checkbox`;
- `label` — `Label`;
- `level` — `Level` (шкала 0–5);
- `avatar` — `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarBadge`;
- `breadcrumb` — `Breadcrumb*`;
- `dropdown-menu` — `DropdownMenu*`;
- `dialog` — `Dialog*` (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, ...);
- `pagination` — `ListPagination` (из `list-pagination.tsx`);
- `table` — `Table*`;
- `toast` — `Toaster`, `toast`, варианты success / error / warning / info.

`src/lib/utils.ts` только реэкспортирует `cn` из пакета `cn`. В новых файлах импортируй `cn` из `@/lib/utils`; часть UI-компонентов исторически импортирует его напрямую из `"cn"`.

### Куда класть новое

- страница и её сценарии → `src/features/<domain>/ui/`, запросы и Server Actions → `api/`, типы и схемы → `model/`, публичный экспорт → `index.ts`;
- домены: `auth`, `users`, `cvs`, `errors`; планируемые — `admin`, `settings` (навыки и языки пока внутри `users`);
- маршрут → тонкий `src/app/<route-group>/<route>/page.tsx` (приватные — в `(platform)`, гостевые — в `(auth)`);
- `views` не выделен: композиция страниц живёт в `features/<domain>/ui`;
- `widgets` — только существующий `sidebar`; новые блоки интерфейса кладём в `features/<domain>/ui` или `shared`;
- бизнес-сущности → `src/entities/` (слой ещё не создан);
- общие функции → `src/shared/helpers/`, хуки → `src/shared/hooks/`, типы → `src/shared/types/`, конфиг → `src/shared/config/`;
- глобальное клиентское состояние → `src/store/` (Zustand, пока не создан).

## Готовый код страниц: `docs/PAGE_CODE.md`

- Пользователь кладёт готовую разметку/код страницы в `docs/PAGE_CODE.md` — переносить её в проект **нашими стилями и компонентами**, не копировать как есть.
- Файл в `.gitignore` — это локальный блокнот.
- Стили: только CSS-переменные и Tailwind-тема из `src/app/globals.css` (`bg-background`, `text-foreground`, `border-border`, ...). Никаких произвольных hex/rgb из присланного кода.
- Компоненты: сначала `src/shared/ui/*`, затем готовое в `src/features/*/ui` и `src/shared`. Не хватает — добавить по структуре и переиспользовать.
- Структура: страница → `src/features/<domain>/ui/`, маршрут → тонкая обёртка в `src/app/<route-group>/<route>/page.tsx`.
- Чужие библиотеки, inline-стили и дубли компонентов из присланного кода отбрасывать.

## GraphQL и codegen

- Схема: `schema.graphql`; полный introspection — `introspectionSchema.full.json`.
- Конфиг: `codegen.ts`. Документы ищутся в `src/features/**/*.{ts,tsx}` и `src/shared/api/**/*.{ts,tsx}`, результат пишется в `src/shared/api/graphql/generated/`.
- Команды: `npm run codegen`, `npm run codegen:watch`.
- Скрипта экспорта схемы в репозитории нет (`scripts/` отсутствует): `schema.graphql` и `introspectionSchema.full.json` обновляются вручную из Playground/интроспекции бэкенда.
- В коде используй `graphql()` из `generated/gql` и типы из `generated/graphql`. Сырые GraphQL-строки допустимы только там, где намеренно используется отдельный транспорт (`proxy.ts`, `shared/api/graphql/graphql.ts`).

## Окружение и бэкенд

- `.env` (не коммитится): `GRAPHQL_URL="http://localhost:3001/api/graphql"`. Читается через `src/shared/config/env.ts`; `NEXT_PUBLIC_` не нужен: доступ к API идёт с сервера.
- Бэкенд — отдельный репозиторий `C:\projects\cv-backend` (NestJS + Apollo, GraphQL на `http://localhost:3001/api/graphql`). Контракт API, авторизация и коды ошибок — `docs/BACKEND.md`.

## Конвенции

- Компоненты: именованный экспорт, `function`-декларации.
- Стили: только Tailwind; условные классы через `cn()`.
- Формы: `react-hook-form` + `zod` (зависимости уже стоят).
- GraphQL-клиент: `graphql-request`, обёртка `gqlRequest` в `src/shared/api/graphql/graphql.ts`.
- Новые варианты UI — расширять `src/shared/ui/<component>`, не стилизовать на месте.

## Скрипты и проверки

- `npm run dev` / `npm run build` / `npm start`;
- `npm run typecheck` — `tsc --noEmit`;
- `npm run lint` — `eslint`;
- `npm test`, `npm run test:watch`, `npm run test:coverage`.

Тесты — Vitest + React Testing Library, лежат рядом с кодом как `*.test.ts(x)`. `vitest.setup.ts` мокает `server-only`, чтобы серверные модули импортировались в unit-тестах. Из coverage в `vitest.config.mts` исключены UI-компоненты и сгенерированный код. Цель по ТЗ — покрытие > 80% (`docs/TZ.md`).

Текущий статус работ — `docs/PROGRESS.md`.

## Коммиты

- Conventional Commits на английском, формат `type: summary` — без scope в скобках и без подписей Co-Authored-By.
- Коммитить только по просьбе; стейджить конкретные файлы; push только по явной просьбе.
- Подробный чек-лист: скилл /commit.

## Git

- Никогда `git add -A` / `git add .` — только конкретные файлы.
- Push только по явной просьбе.
