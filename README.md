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

Обновить схему с запущенного бэкенда:

```bash
node scripts/export-schema.mjs
npm run codegen
```

## Структура

Проект следует Feature-Sliced Design: `app` → `views` → `widgets` → `features` → `entities` → `shared`.

```
src/
  app/                  # маршруты и layout-ы Next.js
    (platform)/         # защищённая часть: sidebar + AuthGate
  features/users/       # фича пользователей: api/ + ui/
  widgets/sidebar/      # боковое меню
  shared/
    api/                # GraphQL-клиент, сессия, ошибки, generated/
    ui/                 # UI-kit
  lib/                  # cn()
docs/
  TZ.md                 # техническое задание
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
- `docs/BACKEND.md` — GraphQL API, авторизация, коды ошибок
- `docs/PROGRESS.md` — что сделано и что осталось
- `CLAUDE.md` — карта кода и конвенции
