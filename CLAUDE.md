## Архитектура

- FSD-подход: `app` (тонкие маршруты) → `features/<domain>/{ui,api,model}` (страницы и сценарии) → `shared/{ui,api,config,helpers,hooks,types}` → `lib`; импорты только вниз. Канон структуры — `docs/STRUCTURE.md`, обоснование — `docs/TZ.md`.
- Команда: 2 разработчика, работа в паре.
- Сейчас реально используются `app`, `widgets`, `features`, `shared`. Слоёв `views`, `entities`, `store` пока нет: композиция страниц лежит в `src/features/<name>/ui`, а файлы `src/app/**` только собирают её. Новые страницы можно класть туда же, пока `views` не выделен.
- Домены фич: `auth`, `users`, `cvs`, `errors`, `skills`, `languages`. Навыки живут в `features/skills` (`/skills`, `/admin/skills`, вкладка `/users/[userId]/skills` — обёртка в `users`), языки — в `features/languages` (`/languages`, `/admin/languages`, вкладка `/users/[userId]/languages`); CV — в `features/cvs`.
- Next.js 16 (App Router) + React 19. `params` и `searchParams` — `Promise`, их нужно `await`. В `next.config.ts` включены `cacheComponents` и `partialPrefetching`.
- Компоненты, читающие `params`, `searchParams`, `cookies()` или `headers()`, обёрнуты в `<Suspense>` в файлах маршрутов — иначе Next 16 падает с blocking-prerender.
- `experimental.serverActions.bodySizeLimit = "8mb"` — аватар уходит в Server Action как base64 (файл до 5MB).
- В `AGENTS.md` предупреждение: API Next 16 отличаются от старых версий — сверяйся с `node_modules/next/dist/docs/`.

## Карта кода

Алиас `@/*` → `src/*` (см. `tsconfig.json`). Ищи готовое здесь, прежде чем писать новое.

### Маршруты и layout-ы

`src/app/`:

- `layout.tsx` — корневой layout: шрифт Roboto, `globals.css`, `THEME_SCRIPT` (тема до гидрации), `DeviceGuard` + `OfflineGuard`, `Toaster`;
- `page.tsx` — редирект с `/` на `/users`;
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
- `(platform)/skills/page.tsx` — личные навыки текущего пользователя;
- `(platform)/languages/page.tsx` — личные языки текущего пользователя;
- `(platform)/admin/skills/page.tsx` — каталог навыков, только Admin: таблица, создание, редактирование, удаление;
- `(platform)/admin/languages/page.tsx` — каталог языков, только Admin: поиск, сортировка по Name и ISO, пагинация, CRUD;
- `(platform)/cvs/page.tsx` — раздел CV для Admin и Employee, читает `search`, `page`, `sort_by`, `sort_order`;
- `(platform)/cvs/[cvId]/layout.tsx` — breadcrumbs `CVs > {CV name} > {tab}`, табы Details / Skills / Projects / Preview и возврат к списку;
- `(platform)/cvs/[cvId]/page.tsx` — редирект на `/cvs/[cvId]/details`;
- `(platform)/cvs/[cvId]/details/page.tsx` — вкладка Details: форма `Name` / `Education` / `Description`;
- `(platform)/cvs/[cvId]/skills/page.tsx` — вкладка Skills: навыки CV по категориям, добавление из навыков владельца, обновление и массовое удаление;
- `(platform)/cvs/[cvId]/projects/page.tsx` — вкладка Projects: проекты CV с поиском и сортировкой, добавление из каталога, обновление и удаление;
- `(platform)/cvs/[cvId]/preview/page.tsx` — вкладка Preview: резюме из CV, профиля, языков и навыков, расчёт Experience / Last Used и `EXPORT PDF` через бэкенд; при нехватке данных — `CV preview is not available`;
- локальные `error.tsx` — у `/users`, `/cvs`, `/cvs/[cvId]/details`, `/cvs/[cvId]/skills`, `/cvs/[cvId]/projects`, `/cvs/[cvId]/preview`, `/users/[userId]/cvs`, `/users/[userId]/skills`, `/users/[userId]/languages`, `/skills`, `/languages`, `/admin/skills`, `/admin/languages`.

`src/proxy.ts` — защита маршрутов: приватные требуют валидную сессию (при истёкшем access-токене обновляет пару через refresh-токен), гостевые (`GUEST_ROUTES`: `/sign-in`, `/sign-up`, `/forgot-password`) отправляют авторизованного на `HOME_ROUTE`. Matcher — все страницы приложения, кроме API и статики (`api`, `_next`, картинки/иконки), поэтому новые маршруты защищены по умолчанию. Тесты — `src/proxy.test.ts`.

Известные пробелы:

- страниц `/departments`, `/positions`, `/projects`, на которые ведут ссылки сайдбара, пока нет (каталоги `/admin/departments`, `/admin/positions` есть);
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
- `api/profile.queries.ts` — `getCurrentProfile`, `getCurrentUserRole`; текущий пользователь (`getCurrentUser`) — в `shared/api/current-user.ts`;
- `api/profile.mutations.ts` — мутации профиля, аватара, отправки письма подтверждения;
- `api/profile.actions.ts` — Server Actions профиля (`updateProfileAction`, `uploadAvatarAction`, `sendVerificationEmailAction`) с проверкой прав;
- `api/profile-levels.actions.ts` — Server Actions обёрток навыков для вкладки `/users/[userId]/skills`: проверяют `getProfilePermissions`, а операции с навыками берут из `@/features/skills`;
- `api/profile-revalidate.ts` — `revalidateUser` (список `/users` и layout всех вкладок пользователя);
- `model/` — `action-result` (`AvatarUploadResult`), `user-schema` (zod, create/update), `user-record`, `profile-schema` (zod), `avatar` (типы и лимит 5MB), `levels` (типы `LevelItem` / `LevelGroup` для вкладки навыков), `level-forms` (клиентская zod-схема вкладки навыков: `createLevelFormSchema` / `LevelFormValues`, чтобы клиентский `LevelManager` не тянул рантайм из барреля `skills`), `cv-permissions` (видимость вкладки CV);
- `ui/` — `users-page`, `users-header`, `users-toolbar`, `users-table`, `users-pagination`, диалоги `create-user-dialog` / `update-user-dialog` / `delete-user-dialog`; `user-layout`, `user-breadcrumbs`, `user-tabs`, `user-current-page`; `profile/user-profile-page`, `profile/user-profile-form`, `profile/avatar-upload`, `profile/profile-skeleton`; `skills/user-skills-page`, `levels/level-manager` (менеджер навыков: списки и диалоги добавления/обновления/удаления), `levels/level-list-skeleton`;
- `index.ts` — публичный экспорт страниц и layout-а.

`src/features/cvs/`:

- `api/cvs.queries.ts` — `getCvs` (все CV, поиск/пагинация), `getCvsByUserId` (вкладка пользователя), `getCv` / `getCvContext` (CV с проверкой доступа), справочники ролей, проектов и категорий навыков;
- `api/cvs.mutations.ts` — create / update / delete CV;
- `api/cvs.actions.ts` — Server Actions CV (`createCvAction` / `updateCvAction` / `deleteCvAction`);
- `api/cv-skills.actions.ts`, `api/cv-projects.actions.ts` — Server Actions навыков и проектов внутри CV;
- `api/cv-preview.actions.ts` — Server Action `exportCvPdfAction`: проверка доступа, сборка HTML резюме и `exportPdf` (base64 + имя файла из названия CV);
- `model/` — `cv-record`, `cv-schema` (zod), `cv-permissions` (`canAccessCv`: Employee — только свои CV, Admin — любые), `cv-skill-schema`, `cv-project-schema`, `cv-project-record` (типы проекта CV и каталога, форматирование дат), `cv-project-roles` (базовый набор ролей проекта), `cv-tabs`, `cv-preview` (сборка резюме, периоды, расчёты Experience / Last Used, PDF-HTML, имя файла);
- `ui/` — `cvs-page`, `cvs-header`, `cvs-toolbar`, `cvs-table`, `cvs-sort-header`, `cvs-pagination`, `cvs-table-skeleton`, `cv-actions-menu`, `cv-dialog`, `delete-cv-dialog`, `user-cvs-page` (вкладка в `/users/[userId]/cvs`); страница CV — `cv-layout`, `cv-breadcrumbs`, `cv-tabs`, `cv-current-tab`, `cv-details-page`, `cv-details-form`, `cv-details-skeleton`, `cv-skills-page`, `cv-skills-manager`, `cv-skills-skeleton`, `cv-projects-page`, `cv-projects-manager`, `cv-project-dialog`, `cv-project-remove-dialog`, `cv-projects-skeleton`, `cv-preview-page`, `cv-preview-view`, `cv-preview-export-button`, `cv-preview-skeleton`;
- `index.ts` — публичный экспорт страниц.

Все модули `api/` помечены `import "server-only"` — их нельзя импортировать из клиентских компонентов. Доступ:

- Admin управляет пользователями (создание, редактирование, удаление) и любыми профилями и аватарами; Employee видит список, но не управляет пользователями;
- Employee правит только свой профиль и аватар, собственные навыки и языки; подтверждение email — только владелец (`model/profile-permissions.ts`);
- вкладка CV в профиле пользователя доступна только Admin (`model/cv-permissions.ts`); Employee при прямом заходе получает 404;
- раздел `/cvs` доступен Admin и Employee: Employee видит и меняет только свои CV, Admin — любые (`cvs/model/cv-permissions.ts`); отказ бэкенда `notOwnCv` показывается как системная ошибка.

`src/features/skills/` — навыки и каталог навыков:

- `api/skills.queries.ts` — `getMySkills`, `getUserSkills` (навыки любого пользователя), `getSkillsCatalog`, `findSkillByName`, `getSkillCategories`, `getSkillOptions`;
- `api/profile-skills.mutations.ts` — мутации навыков профиля (`addMySkill` / `updateMySkill` / `deleteMySkill`, принимают `userId`);
- `api/profile-skills.actions.ts` — Server Actions навыков текущего пользователя для `/skills`;
- `api/catalog.mutations.ts`, `api/catalog.actions.ts` — CRUD каталога, только Admin;
- `api/skills-revalidate.ts` — инвалидация `/skills`, `/users/[userId]/skills` и `/admin/skills`;
- `api/current-user.ts`, `api/run-authed.ts`, `model/action-result.ts` — собственный серверный транспорт фичи, чтобы не импортировать `users`;
- `model/skill-levels.ts` — `SKILL_MASTERY_VALUES`, `MASTERY_MAX`, `masteryLevel`, `groupSkills`;
- `model/skill-schema.ts` — сообщения и zod-схемы форм и Server Actions навыков;
- `model/skill-record.ts`, `model/skill-permissions.ts` — типы каталога и права Admin;
- `ui/skills-page.tsx`, `ui/skills-manager.tsx`, `ui/skills-manager-skeleton.tsx` — личная страница `/skills`;
- `ui/admin/*` — каталог `/admin/skills`: таблица, поиск, пагинация, диалоги создания/редактирования/удаления;
- `index.ts` — публичный API: страницы, запросы, мутации, схемы и модель мастерства.

`skills` не импортирует `users`. Вкладка `/users/[userId]/skills` остаётся композицией в `users` (`ui/skills/user-skills-page`, `ui/levels/level-manager`) и получает данные и операции из `@/features/skills`. Кросс-фичевые импорты — только через `index.ts`.

`src/features/languages/` — личные языки и каталог языков:

- `api/languages.queries.ts` — `getMyLanguages` (текущий профиль), `getMyLanguagesWithToken`, `getUserLanguages` / `getUserLanguagesWithToken` (языки любого пользователя), `getLanguagesCatalog`, `findLanguageByName` (точное совпадение без учёта регистра), `findLanguageByIso` (перебор страниц каталога), `getLanguageOptions`;
- `api/profile-languages.mutations.ts` — `addMyLanguage` / `updateMyLanguage` / `deleteMyLanguage` (принимают `userId` и имя языка);
- `api/profile-languages.actions.ts` — Server Actions для `/languages` и вкладки `/users/[userId]/languages`: `addLanguageAction` / `updateLanguageAction` / `deleteLanguagesAction(userId, ...)`, проверка `getProfilePermissions` (владелец или Admin), валидация, маппинг `languageHasBeenAdded` в «Language already exists»;
- `api/catalog.mutations.ts`, `api/catalog.actions.ts` — CRUD каталога, только Admin; проверяют дубликаты по имени и ISO, ISO приводится к верхнему регистру;
- `api/languages-revalidate.ts` — `revalidateLanguageCatalog` и `revalidateLanguages(userId)`: инвалидация `/languages`, `/admin/languages` и `/users/[userId]/languages`;
- `api/current-user.ts`, `api/run-authed.ts`, `model/action-result.ts` — собственный серверный транспорт фичи;
- `model/language-levels.ts` — `LANGUAGE_PROFICIENCY_VALUES` (A1…Native), `PROFICIENCY_MAX`, `proficiencyLevel`, тип `LanguageItem`;
- `model/language-schema.ts` — сообщения и zod-схемы форм и Server Actions; `model/language-record.ts`, `model/language-permissions.ts` — типы каталога и права Admin;
- `ui/languages-page.tsx`, `ui/languages-manager.tsx`, `ui/languages-manager-skeleton.tsx` — личная страница `/languages`: секция Current Languages, добавление, редактирование Proficiency, удаление выбранных; `LanguagesManager` принимает `userId`, `canManage` и используется также во вкладке пользователя;
- `ui/user-languages-page.tsx` — вкладка `/users/[userId]/languages`: данные пользователя, права владельца/Admin, рендер `LanguagesManager`;
- `ui/admin/*` — каталог `/admin/languages`: header с поиском и созданием, таблица Name / ISO / Native Name с сортировкой, пагинация, диалоги создания/редактирования/удаления;
- `index.ts` — публичный API фичи.

`languages` не импортирует `users`. Вкладка `/users/[userId]/languages` — композиция внутри `languages` (`ui/user-languages-page.tsx`); `users` использует языки только через публичный `index.ts` (например, `proficiencyLevel` в деталях CV). Права профиля — общий `getProfilePermissions` из `src/shared/helpers/profile-permissions.ts`.

### Widgets

- `src/widgets/sidebar/` — боковое меню (`"use client"`): collapse, активный пункт по `usePathname`, ссылки на Employees / Skills / Languages / CVs и Departments / Positions / Projects; пункты Skills и Languages в management-группе видны только Admin. Новых виджетов не добавляем (см. «Куда класть новое»).

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

`src/shared/helpers/` — `redirect-path.ts` (`safeRedirectPath`), `date-formatter.ts`, `profile-permissions.ts` (`getProfilePermissions`: владелец или Admin), `go-back.ts`, `reload-page.ts`, `index.ts`.

`src/shared/hooks/` — `use-media-query.ts`, `use-online-status.ts`.

`src/shared/types/` — `user-role.ts` (`USER_ROLES`, `UserRoleValue`).

UI-kit — `src/shared/ui/<component>/`, экспорт через `index.ts`:

- `button` — `Button` (default / primary / secondary / outline / ghost / icon), `buttonVariants`;
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
- домены: `auth`, `users`, `cvs`, `errors`, `skills`, `languages`; планируемые — `admin`, `settings`;
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
