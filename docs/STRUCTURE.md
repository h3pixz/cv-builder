# Структура проекта

Каноническая структура репозитория. Подход Feature-Sliced Design: `app` → `features` → `shared`, импорты только вниз. Страницы живут в `features/<domain>/ui`, а маршруты в `app` — тонкие обёртки без бизнес-логики.

Разделы, помеченные `план`, ещё не реализованы: файлы создаются вместе с функционалом, в пустых папках лежит только `.gitkeep`.

```
cv-builder/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
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
│   │   ├── (dashboard)/                # план
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── cvs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [cvId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── preview/
│   │   │   │           └── page.tsx
│   │   │   ├── skills/
│   │   │   │   └── page.tsx
│   │   │   ├── languages/
│   │   │   │   └── page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── skills/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── languages/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── positions/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── departments/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── projects/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx               # план
│   │   └── error.tsx                   # план
│   │
│   ├── proxy.ts                        # проверка сессии для приватных маршрутов
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
│   │   │   │   └── request-origin.ts
│   │   │   ├── model/                  # схемы валидации
│   │   │   │   ├── validation.ts
│   │   │   │   ├── sign-in-schema.ts
│   │   │   │   ├── sign-up-schema.ts
│   │   │   │   ├── forgot-password-schema.ts
│   │   │   │   └── reset-password-schema.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── users/                      # план
│   │   │   ├── ui/
│   │   │   ├── api/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   │
│   │   ├── cvs/                        # план
│   │   │   ├── ui/
│   │   │   ├── api/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   │
│   │   ├── skills/                     # план
│   │   │   ├── ui/
│   │   │   ├── api/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   │
│   │   ├── languages/                  # план
│   │   │   ├── ui/
│   │   │   ├── api/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/                      # план
│   │   │   ├── ui/
│   │   │   ├── api/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   │
│   │   └── settings/                   # план
│   │       ├── ui/
│   │       ├── api/
│   │       ├── model/
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── ui/                         # UI-kit: button, input, textarea, select, level, toast
│   │   ├── api/
│   │   │   ├── graphql/
│   │   │   │   ├── client.ts
│   │   │   │   ├── errors.ts
│   │   │   │   ├── generated/          # типы из схемы (codegen)
│   │   │   │   │   ├── gql.ts
│   │   │   │   │   ├── graphql.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── documents.ts        # общие документы (UpdateToken)
│   │   │   │   └── index.ts
│   │   │   ├── session.ts
│   │   │   ├── session-cookies.ts      # имена cookie и настройки сессии
│   │   │   └── index.ts
│   │   ├── config/                     # переменные окружения и настройки
│   │   ├── helpers/                    # переиспользуемые чистые функции
│   │   ├── hooks/                      # общие React-хуки
│   │   └── types/                      # общие типы
│   │
│   ├── lib/
│   │   ├── utils.ts                    # cn() и утилиты библиотек
│   │   └── utils.test.ts
│   │
│   └── store/                          # план: глобальное состояние Zustand
│       ├── index.ts
│       ├── ui.store.ts
│       └── user.store.ts
│
├── e2e/                                # план: Playwright
│
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
├── vitest.config.mts
├── playwright.config.ts                # план
└── package.json
```

## Правила

- Маршрут — тонкий `page.tsx` в `src/app/<route-group>/<route>/`; вся разметка и логика — в `features/<domain>/ui`.
- Внутри фичи: `ui` не импортирует `api` вышестоящих слоёв; типы и схемы — в `model`, запросы и Server Actions — в `api`, наружу — только через `index.ts`.
- Общее переиспользуемое — `shared` (сначала `shared/ui`, затем `shared/helpers`, `hooks`, `types`, `config`).
- Глобальное клиентское состояние (черновик резюме, UI) — в `src/store` (Zustand); серверные данные в store не дублируются.
- Тесты — рядом с модулем: `*.test.ts(x)` (Vitest + Testing Library); сквозные — в `e2e/` (Playwright).
