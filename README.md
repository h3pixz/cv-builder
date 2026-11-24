# CV Builder

Веб-приложение для создания и редактирования резюме. Next.js (App Router) + GraphQL-бэкенд из отдельного репозитория.

## Стек

- **Next.js 16** (App Router, Server Components), **React 19**, **TypeScript**
- **Tailwind CSS 4**, UI-kit на **Base UI** / shadcn-подходе
- **graphql-request** + **@graphql-codegen/cli** (типы и документы генерируются из схемы)
- **Vitest** + **React Testing Library**
- **react-hook-form**, **zod**, **zustand** (установлены для форм и клиентского состояния)

## Требования

- Node.js 20+
- Локальный GraphQL-бэкенд на `http://localhost:3001/api/graphql` — см. `docs/BACKEND.md`

## Запуск

```bash
npm install
```

Создайте `.env` в корне:

```sh
GRAPHQL_URL="http://localhost:3001/api/graphql"
```

```bash
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

## Скрипты

| Команда                       | Что делает                                       |
| ----------------------------- | ------------------------------------------------ |
| `npm run dev`                 | dev-сервер Next.js                               |
| `npm run build` / `npm start` | production-сборка и запуск                       |
| `npm run lint`                | ESLint                                           |
| `npm run typecheck`           | `tsc --noEmit`                                   |
| `npm test`                    | unit-тесты (Vitest, один прогон)                 |
| `npm run test:watch`          | unit-тесты в watch-режиме                        |
| `npm run test:coverage`       | покрытие (v8)                                    |
| `npm run codegen`             | генерация типов и документов из `schema.graphql` |
| `npm run codegen:watch`       | codegen в watch-режиме                           |

Обновить `schema.graphql` и `introspectionSchema.full.json` с запущенного бэкенда (Playground / introspection API), затем перегенерировать типы:

```bash
npm run codegen
```

## Структура

Проект следует Feature-Sliced Design: `app` → `features` → `shared`. Композиция страниц живёт в `features/<domain>/ui`, маршруты в `app` — тонкие обёртки. Слои `views`, `entities` и `store` пока не выделены.

```
src/
  app/                  # маршруты и layout-ы Next.js
    (auth)/             # sign-in, sign-up, forgot/reset password, verify-email
    (platform)/         # защищённая часть: sidebar + AuthGate; users, cvs, skills, languages, settings, admin/*
  proxy.ts              # проверка сессии и refresh токенов
  features/
    auth/               # страницы и Server Actions авторизации
    errors/             # 404, No Internet, Device Error
    users/              # сотрудники: список, профиль, вкладки навыков и языков
    cvs/                # резюме: список и страница CV с вкладками
    skills/             # личные навыки и каталог навыков (Admin)
    languages/          # личные языки и каталог языков (Admin)
    departments/        # каталог департаментов (Admin)
    positions/          # каталог позиций (Admin)
    projects/           # каталог проектов (Admin)
    settings/           # настройки: тема, язык, смена пароля
  widgets/sidebar/      # боковое меню
  shared/
    api/                # GraphQL-клиент, сессия, ошибки, generated/
    ui/                 # UI-kit
    config/             # env, маршруты, тема
    helpers/            # общие чистые функции
    hooks/              # общие React-хуки
  lib/                  # cn()
e2e/                    # план: Playwright
docs/
  TZ.md                 # техническое задание
  STRUCTURE.md          # полное дерево проекта
  BACKEND.md            # контракт GraphQL-бэкенда
  PROGRESS.md           # текущий статус работ
```

Подробная карта кода и конвенции — в `CLAUDE.md`.

## Тесты

Тесты лежат рядом с кодом как `*.test.ts(x)`.

```bash
npm test
npm run test:coverage
```

## Документация

- `docs/TZ.md` — требования
- `docs/STRUCTURE.md` — каноническая структура проекта
- `docs/BACKEND.md` — GraphQL API, авторизация, коды ошибок
- `docs/PROGRESS.md` — что сделано и что осталось
- `CLAUDE.md` — карта кода и конвенции
