# Структура проекта

Каноническая структура репозитория. Подход Feature-Sliced Design: `app` → `features` → `shared`, импорты только вниз. Страницы живут в `features/<domain>/ui`, а маршруты в `app` — тонкие обёртки без бизнес-логики.

Разделы, помеченные `план`, ещё не реализованы: папки и файлы создаются вместе с функционалом, пустые заглушки не держим.

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
│   │   │   ├── forgot-password/        # план
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/         # план
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/           # план
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
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── ui/
│   │   │   │   ├── sign-in-page.tsx
│   │   │   │   ├── sign-up-page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── auth-tabs.tsx
│   │   │   │       ├── sign-in-form.tsx
│   │   │   │       └── sign-up-form.tsx
│   │   │   ├── api/                    # план: Server Actions
│   │   │   ├── model/                  # план: схемы и типы
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
│   │   │   │   └── index.ts
│   │   │   ├── session.ts
│   │   │   └── index.ts
│   │   ├── config/                     # переменные окружения и настройки
│   │   ├── helpers/                    # переиспользуемые чистые функции
│   │   ├── hooks/                      # общие React-хуки
│   │   └── types/                      # общие типы
│   │
│   ├── lib/
│   │   └── utils.ts                    # cn() и утилиты библиотек
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
