# Структура проекта

Каноническая структура репозитория. Подход Feature-Sliced Design: `app` → `features` → `shared`, импорты только вниз. Страницы живут в `features/<domain>/ui`, а маршруты в `app` — тонкие обёртки без бизнес-логики.

Разделы, помеченные `план`, ещё не реализованы: файлы создаются вместе с функционалом. Слои `views`, `entities` и `store` пока не выделены.

```
cv-builder/
│
├── src/
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (platform)/
│   │   │   ├── layout.tsx              # Sidebar + AuthGate
│   │   │   ├── cvs/
│   │   │   │   ├── page.tsx            # раздел CV
│   │   │   │   ├── error.tsx
│   │   │   │   └── [cvId]/
│   │   │   │       ├── layout.tsx      # breadcrumbs + табы CV
│   │   │   │       ├── page.tsx        # редирект на /cvs/[cvId]/details
│   │   │   │       ├── details/
│   │   │   │       │   ├── page.tsx    # форма Details
│   │   │   │       │   └── error.tsx
│   │   │   │       ├── skills/
│   │   │   │       │   ├── page.tsx    # навыки CV
│   │   │   │       │   └── error.tsx
│   │   │   │       └── projects/
│   │   │   │           ├── page.tsx    # проекты CV
│   │   │   │           └── error.tsx
│   │   │   └── users/
│   │   │       ├── page.tsx            # список сотрудников
│   │   │       ├── error.tsx
│   │   │       └── [userId]/
│   │   │           ├── layout.tsx      # breadcrumbs + табы
│   │   │           ├── page.tsx        # редирект на /profile
│   │   │           ├── profile/
│   │   │           │   └── page.tsx
│   │   │           ├── skills/
│   │   │           │   ├── page.tsx
│   │   │           │   └── error.tsx
│   │   │           ├── languages/
│   │   │           │   ├── page.tsx
│   │   │           │   └── error.tsx
│   │   │           └── cvs/            # вкладка CV в профиле (Admin)
│   │   │               ├── page.tsx
│   │   │               ├── error.tsx
│   │   │               └── [cvId]/
│   │   │                   └── page.tsx # редирект на /cvs/[cvId]/details
│   │   │
│   │   ├── layout.tsx                  # шрифт, тема, guards, Toaster
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── error.tsx                   # No Internet
│   │   ├── global-error.tsx
│   │   └── not-found.tsx               # 404
│   │
│   ├── proxy.ts                        # проверка сессии и refresh для приватных маршрутов
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── ui/
│   │   │   │   ├── sign-in-page.tsx
│   │   │   │   ├── sign-up-page.tsx
│   │   │   │   ├── forgot-password-page.tsx
│   │   │   │   ├── reset-password-page.tsx
│   │   │   │   ├── verify-email-page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── auth-link.tsx
│   │   │   │       ├── auth-tabs.tsx
│   │   │   │       ├── form-error.tsx
│   │   │   │       ├── forgot-password-form.tsx
│   │   │   │       ├── reset-password-form.tsx
│   │   │   │       ├── sign-in-form.tsx
│   │   │   │       ├── sign-up-form.tsx
│   │   │   │       ├── verify-email-form.tsx
│   │   │   │       └── *.test.tsx
│   │   │   ├── api/                    # Server Actions
│   │   │   │   ├── action-result.ts
│   │   │   │   ├── documents.ts
│   │   │   │   ├── login.ts
│   │   │   │   ├── signup.ts
│   │   │   │   ├── verify-email.ts
│   │   │   │   ├── forgot-password.ts
│   │   │   │   ├── reset-password.ts
│   │   │   │   ├── logout.ts
│   │   │   │   └── token-payload.ts
│   │   │   ├── model/                  # схемы валидации
│   │   │   │   ├── validation.ts
│   │   │   │   ├── sign-in-schema.ts
│   │   │   │   ├── sign-up-schema.ts
│   │   │   │   ├── forgot-password-schema.ts
│   │   │   │   └── reset-password-schema.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── errors/
│   │   │   ├── ui/
│   │   │   │   ├── no-internet-page.tsx
│   │   │   │   ├── not-found-page.tsx
│   │   │   │   ├── device-error-page.tsx
│   │   │   │   ├── sad-monitor-illustration.tsx
│   │   │   │   ├── offline-guard.tsx
│   │   │   │   ├── device-guard.tsx
│   │   │   │   └── *.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── users/
│   │   │   ├── ui/
│   │   │   │   ├── users-page.tsx
│   │   │   │   ├── users-header.tsx
│   │   │   │   ├── users-toolbar.tsx
│   │   │   │   ├── users-table.tsx
│   │   │   │   ├── users-pagination.tsx
│   │   │   │   ├── create-user-dialog.tsx
│   │   │   │   ├── update-user-dialog.tsx
│   │   │   │   ├── delete-user-dialog.tsx
│   │   │   │   ├── user-layout.tsx
│   │   │   │   ├── user-breadcrumbs.tsx
│   │   │   │   ├── user-tabs.tsx
│   │   │   │   ├── user-current-page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   ├── user-profile-page.tsx
│   │   │   │   │   ├── user-profile-form.tsx
│   │   │   │   │   ├── avatar-upload.tsx
│   │   │   │   │   └── profile-skeleton.tsx
│   │   │   │   ├── skills/
│   │   │   │   │   └── user-skills-page.tsx
│   │   │   │   ├── languages/
│   │   │   │   │   └── user-languages-page.tsx
│   │   │   │   └── levels/
│   │   │   │       ├── level-manager.tsx
│   │   │   │       └── level-list-skeleton.tsx
│   │   │   ├── api/
│   │   │   │   ├── users.queries.ts
│   │   │   │   ├── users.mutations.ts
│   │   │   │   ├── users.actions.ts
│   │   │   │   ├── profile.queries.ts
│   │   │   │   ├── profile.mutations.ts
│   │   │   │   ├── profile.actions.ts
│   │   │   │   ├── profile-levels.actions.ts
│   │   │   │   └── profile-revalidate.ts
│   │   │   ├── model/
│   │   │   │   ├── action-result.ts
│   │   │   │   ├── user-schema.ts
│   │   │   │   ├── user-record.ts
│   │   │   │   ├── profile-schema.ts
│   │   │   │   ├── profile-permissions.ts
│   │   │   │   ├── avatar.ts
│   │   │   │   ├── level-forms.ts
│   │   │   │   └── cv-permissions.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── cvs/
│   │   │   ├── ui/
│   │   │   │   ├── cvs-page.tsx
│   │   │   │   ├── cvs-header.tsx
│   │   │   │   ├── cvs-toolbar.tsx
│   │   │   │   ├── cvs-table.tsx
│   │   │   │   ├── cvs-sort-header.tsx
│   │   │   │   ├── cvs-pagination.tsx
│   │   │   │   ├── cvs-table-skeleton.tsx
│   │   │   │   ├── cv-actions-menu.tsx
│   │   │   │   ├── cv-dialog.tsx
│   │   │   │   ├── delete-cv-dialog.tsx
│   │   │   │   ├── user-cvs-page.tsx
│   │   │   │   ├── cv-layout.tsx
│   │   │   │   ├── cv-breadcrumbs.tsx
│   │   │   │   ├── cv-tabs.tsx
│   │   │   │   ├── cv-current-tab.tsx
│   │   │   │   ├── cv-details-page.tsx
│   │   │   │   ├── cv-details-form.tsx
│   │   │   │   ├── cv-details-skeleton.tsx
│   │   │   │   ├── cv-skills-page.tsx
│   │   │   │   ├── cv-skills-manager.tsx
│   │   │   │   ├── cv-skills-skeleton.tsx
│   │   │   │   ├── cv-projects-page.tsx
│   │   │   │   ├── cv-projects-manager.tsx
│   │   │   │   ├── cv-project-dialog.tsx
│   │   │   │   ├── cv-project-remove-dialog.tsx
│   │   │   │   └── cv-projects-skeleton.tsx
│   │   │   ├── api/
│   │   │   │   ├── cvs.queries.ts
│   │   │   │   ├── cvs.mutations.ts
│   │   │   │   ├── cvs.actions.ts
│   │   │   │   ├── cv-skills.actions.ts
│   │   │   │   └── cv-projects.actions.ts
│   │   │   ├── model/
│   │   │   │   ├── cv-record.ts
│   │   │   │   ├── cv-schema.ts
│   │   │   │   ├── cv-permissions.ts
│   │   │   │   ├── cv-skill-schema.ts
│   │   │   │   ├── cv-project-schema.ts
│   │   │   │   ├── cv-project-record.ts
│   │   │   │   └── cv-tabs.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── skills/                     # план
│   │   ├── languages/                  # план
│   │   ├── admin/                      # план
│   │   └── settings/                   # план
│   │
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── avatar/
│   │   │   ├── breadcrumb/
│   │   │   ├── button/
│   │   │   ├── checkbox/
│   │   │   ├── dialog/
│   │   │   ├── dropdown-menu/
│   │   │   ├── input/
│   │   │   ├── label/
│   │   │   ├── level/
│   │   │   ├── pagination/
│   │   │   ├── select/
│   │   │   ├── table/
│   │   │   ├── textarea/
│   │   │   └── toast/
│   │   ├── api/
│   │   │   ├── graphql/
│   │   │   │   ├── graphql.ts          # gqlRequest()
│   │   │   │   └── generated/          # типы из схемы (codegen)
│   │   │   ├── authed-request/
│   │   │   │   └── authed-request.ts   # authedGqlRequest, authedGqlRequestWithRefresh
│   │   │   ├── protected/
│   │   │   │   └── protected.ts        # protectedRequest
│   │   │   ├── documents/
│   │   │   │   └── documents.ts        # общие документы (UpdateToken)
│   │   │   ├── errors/
│   │   │   │   └── errors.ts           # коды и тексты ошибок
│   │   │   ├── jwt/
│   │   │   │   └── jwt.ts              # проверка срока access-токена
│   │   │   ├── session/
│   │   │   │   └── session.ts
│   │   │   ├── session-cookies/
│   │   │   │   └── session-cookies.ts  # имена cookie и настройки сессии
│   │   │   ├── action-result.ts        # ActionResult, toActionError
│   │   │   ├── current-user.ts         # getCurrentUser из claims токена
│   │   │   ├── run-authed.ts           # runAuthed с refresh-ретраем
│   │   │   ├── request-origin.ts       # origin запроса для ссылок в письмах
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── routes.ts
│   │   │   ├── theme-script.ts
│   │   │   └── index.ts
│   │   ├── helpers/
│   │   │   ├── date-formatter.ts
│   │   │   ├── go-back.ts
│   │   │   ├── levels.ts               # Mastery/Proficiency и группировка
│   │   │   ├── redirect-path.ts
│   │   │   ├── reload-page.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── use-media-query.ts
│   │   │   └── use-online-status.ts
│   │   └── types/
│   │       └── user-role.ts
│   │
│   ├── widgets/
│   │   └── sidebar/
│   │       ├── sidebar.tsx
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                    # cn()
│   │   └── utils.test.ts
│   │
│   └── store/                          # план: глобальное состояние Zustand
│
├── e2e/                                # план: Playwright
│
├── docs/
│   ├── BACKEND.md
│   ├── PAGE_CODE.md                    # в .gitignore
│   ├── PROGRESS.md
│   ├── STRUCTURE.md
│   ├── TZ.md
│   └── reports/                        # в .gitignore
│
├── .env.example
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── codegen.ts
├── components.json
├── eslint.config.mjs
├── introspectionSchema.full.json
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── schema.graphql
├── tsconfig.json
├── vitest.config.mts
└── vitest.setup.ts
```

## Правила

- Маршрут — тонкий `page.tsx` в `src/app/<route-group>/<route>/`; вся разметка и логика — в `features/<domain>/ui`.
- Async-компоненты, читающие `params`, `searchParams`, `cookies()` или `headers()`, оборачиваются в `<Suspense>` в файле маршрута (Next 16 + `cacheComponents`).
- Внутри фичи: `ui` не импортирует `api` вышестоящих слоёв; типы и схемы — в `model`, запросы и Server Actions — в `api`, наружу — только через `index.ts`.
- Общее переиспользуемое — `shared` (сначала `shared/ui`, затем `shared/helpers`, `hooks`, `types`, `config`).
- Глобальное клиентское состояние (черновик резюме, UI) — в `src/store` (Zustand), когда слой появится; серверные данные в store не дублируются.
- Тесты — рядом с модулем: `*.test.ts(x)` (Vitest + Testing Library); сквозные — в `e2e/` (Playwright, план).
