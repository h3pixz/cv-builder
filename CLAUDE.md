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
- **Новые фичи класть по FSD** (папок пока нет — создавай при первом использовании):
  - формы (личные данные, опыт, образование, навыки, валидация) → `src/features/<name>/`;
  - сущность резюме, GraphQL-запросы → `src/entities/resume/`;
  - шапка, превью резюме → `src/widgets/`;
  - страницы (список, редактор) → `src/views/`;
  - хуки и API-клиент → `src/shared/hooks/`, `src/shared/api/`.

## Коммиты
- Conventional Commits на английском, без подписей Co-Authored-By.
- Коммитить только по просьбе; стейджить конкретные файлы; push только по явной просьбе.
- Подробный чек-лист: скилл /commit. Отчёт за день: скилл /daily-report.
