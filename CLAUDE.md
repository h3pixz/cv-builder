## Архитектура
- FSD-подход: `app` (тонкие маршруты) → `features/<domain>/{ui,api,model}` (страницы и сценарии) → `shared/{ui,api,config,helpers,hooks,types}` → `lib`; импорты только вниз. Канон структуры — `docs/STRUCTURE.md`, обоснование — `docs/TZ.md`.
- Команда: 2 разработчика, работа в паре.

## Карта кода
Алиас `@/*` → `src/*` (см. `tsconfig.json`). Ищи готовое здесь, прежде чем писать новое:

- **Маршруты / layout:** `src/app/` — `layout.tsx` (корневой, подключает `Toaster`), `page.tsx` (главная), `globals.css` (Tailwind-тема). Route groups: `(auth)` — `sign-in`, `sign-up`; `(dashboard)` — приватная часть (план).
- **Утилиты:** `src/lib/utils.ts` — `cn()`.
- **API и сессия:** `src/shared/api/` — `graphql/client.ts` (`gqlRequest` на graphql-request), `graphql/errors.ts` (`getGraphQLErrorCode` / `getGraphQLErrorMessage` / `ERROR_MESSAGES`), `session.ts` (`getSession` / `saveSession` / `clearSession` / `refreshSession` на httpOnly cookie). `GRAPHQL_URL` читается через `src/shared/config/env.ts`.
- **Бэкенд:** отдельный репозиторий `C:\projects\cv-backend` (NestJS + Apollo, GraphQL на `http://localhost:3001/api/graphql`). Контракт API, авторизация, коды ошибок — `docs/BACKEND.md`.
- **UI-kit:** `src/shared/ui/<component>/`, экспорт через `index.ts`:
  - `button` — `Button` (default / primary / secondary / ghost / icon);
  - `input` — `Input` (default / error, переключатель пароля);
  - `textarea` — `Textarea` (default / error);
  - `select` — `SelectField` (одиночный), `MultiselectField` (мультивыбор с чипами), примитивы `Select*`;
  - `level` — `Level` (шкала 0–5);
  - `toast` — `Toaster`, `toast` (менеджер), варианты success / error / warning / info.
- **Готовые страницы:** `src/features/auth/ui` — `sign-in-page`, `sign-up-page`, формы и `AuthTabs` в `ui/components`; маршруты — `src/app/(auth)/sign-in`, `src/app/(auth)/sign-up` (URL `/sign-in`, `/sign-up`).
- **Куда класть новое:**
  - страница и её сценарии → `src/features/<domain>/ui/`, запросы и Server Actions → `api/`, типы и схемы → `model/`, публичный экспорт → `index.ts`;
  - домены: `auth`, `users`, `cvs`, `skills`, `languages`, `admin`, `settings`;
  - маршрут → тонкий `src/app/<route-group>/<route>/page.tsx`;
  - общие функции → `src/shared/helpers/`, хуки → `src/shared/hooks/`, типы → `src/shared/types/`, конфиг → `src/shared/config/`;
  - глобальное клиентское состояние → `src/store/` (Zustand).
- **Не использовать** слои `views` и `widgets`: страницы и их блоки живут в `features/<domain>/ui`, общее — в `shared`.

## Готовый код страниц: `docs/PAGE_CODE.md`
- Пользователь кладёт готовую разметку/код страницы в `docs/PAGE_CODE.md` — переносить её в проект **нашими стилями и компонентами**, не копировать как есть.
- Стили: только CSS-переменные и Tailwind-тема из `src/app/globals.css` (`bg-background`, `text-foreground`, `border-border`, ...). Никаких произвольных hex/rgb из присланного кода.
- Компоненты: сначала `src/shared/ui/*`, затем готовое в `src/features/*/ui` и `src/shared`. Не хватает — добавить по структуре и переиспользовать.
- Структура: страница → `src/features/<domain>/ui/`, маршрут → тонкая обёртка в `src/app/<route-group>/<route>/page.tsx`.
- Чужие библиотеки, inline-стили и дубли компонентов из присланного кода отбрасывать.

## Коммиты
- Conventional Commits на английском, формат `type: summary` — без scope в скобках и без подписей Co-Authored-By.
- Коммитить только по просьбе; стейджить конкретные файлы; push только по явной просьбе.
- Подробный чек-лист: скилл /commit. Отчёт за день: скилл /daily-report.
