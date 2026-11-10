## Архитектура
- FSD: слои `app` → `views` → `widgets` → `features` → `entities` → `shared`, импорты только вниз. Подробнее: `docs/TZ.md`.
- Команда: 2 разработчика, работа в паре.

## Карта кода
Алиас `@/*` → `src/*` (см. `tsconfig.json`). Ищи готовое здесь, прежде чем писать новое:

- **Маршруты / layout:** `src/app/` — `layout.tsx` (корневой, подключает `Toaster`), `page.tsx` (главная), `globals.css` (Tailwind-тема).
- **Утилиты:** `src/lib/utils.ts` — `cn()`.
- **API и сессия:** `src/shared/api/` — `gqlRequest` (graphql-request + `GRAPHQL_URL`), `getSession` / `saveSession` / `clearSession` / `refreshSession` на httpOnly cookie, маппинг ошибок бэкенда `getGraphQLErrorCode` / `getGraphQLErrorMessage` / `ERROR_MESSAGES`.
- **Бэкенд:** отдельный репозиторий `C:\projects\cv-backend` (NestJS + Apollo, GraphQL на `http://localhost:3001/api/graphql`). Контракт API, авторизация, коды ошибок — `docs/BACKEND.md`.
- **UI-kit:** `src/shared/ui/<component>/`, экспорт через `index.ts`:
  - `button` — `Button` (default / primary / secondary / ghost / icon);
  - `input` — `Input` (default / error, переключатель пароля);
  - `textarea` — `Textarea` (default / error);
  - `select` — `SelectField` (одиночный), `MultiselectField` (мультивыбор с чипами), примитивы `Select*`;
  - `level` — `Level` (шкала 0–5);
  - `toast` — `Toaster`, `toast` (менеджер), варианты success / error / warning / info.
- **Готовые страницы:** `src/views/login`, `src/views/signup` (формы авторизации; маршруты `src/app/login`, `src/app/signup`); общие табы — `src/widgets/auth-tabs`.
- **Новые фичи класть по FSD** (остальных папок пока нет — создавай при первом использовании):
  - формы (личные данные, опыт, образование, навыки, валидация) → `src/features/<name>/`;
  - сущность резюме, GraphQL-запросы → `src/entities/resume/`;
  - шапка, превью резюме → `src/widgets/`;
  - страницы (список, редактор) → `src/views/`;
  - хуки и API-клиент → `src/shared/hooks/`, `src/shared/api/`.

## Готовый код страниц: `docs/PAGE_CODE.md`
- Пользователь кладёт готовую разметку/код страницы в `docs/PAGE_CODE.md` — переносить её в проект **нашими стилями и компонентами**, не копировать как есть.
- Стили: только CSS-переменные и Tailwind-тема из `src/app/globals.css` (`bg-background`, `text-foreground`, `border-border`, ...). Никаких произвольных hex/rgb из присланного кода.
- Компоненты: сначала `src/shared/ui/*`, затем готовое в `views` / `widgets` / `features` / `entities`. Не хватает — добавить по FSD и переиспользовать.
- Структура: страница → `src/views/<page>/`, маршрут → тонкая обёртка в `src/app/<route>/page.tsx`.
- Чужие библиотеки, inline-стили и дубли компонентов из присланного кода отбрасывать.

## Коммиты
- Conventional Commits на английском, без подписей Co-Authored-By.
- Коммитить только по просьбе; стейджить конкретные файлы; push только по явной просьбе.
- Подробный чек-лист: скилл /commit. Отчёт за день: скилл /daily-report.
