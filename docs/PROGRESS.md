# Прогресс CV Builder

Источник требований: `docs/TZ.md`.

## Done

- [x] Инициализировать Next.js (App Router) + TypeScript
- [x] Настроить ESLint и алиас `@/*`
- [x] Добавить корневой `layout.tsx` и стартовую `page.tsx`

## In progress

- [ ] Согласовать с ментором UI-библиотеку, state manager и отказ от Apollo Client (Server Components + `fetch` / Server Actions)
- [ ] Подключить Tailwind CSS и UI-библиотеку

## Backlog

- [ ] Настроить npm-скрипты: `typecheck`, `test`, `test:coverage`
- [ ] Настроить Vitest + React Testing Library + coverage
- [ ] Создать общий layout: шапка, навигация, контейнер
- [ ] Настроить маршруты: список резюме, редактор, превью
- [ ] Применить SSR/SSG для страниц, где уместно
- [ ] Настроить GraphQL-клиент для Server Components (`fetch` + кэш Next.js)
- [ ] Описать схему и поднять локальный GraphQL-бэкенд
- [ ] Реализовать CRUD-запросы резюме (Server Components / Server Actions) и инвалидацию кэша
- [ ] Настроить store (Zustand/RTK) — по согласованию
- [ ] Хранить черновик резюме в глобальном состоянии
- [ ] Форма личных данных и контактов
- [ ] Форма опыта работы
- [ ] Форма образования и навыков
- [ ] Валидация полей формы
- [ ] Живое превью резюме
- [ ] Сохранение и загрузка резюме через API
- [ ] Адаптивная вёрстка: mobile / tablet / desktop
- [ ] Unit-тесты компонентов и стора, покрытие > 80%
- [ ] Extra: E2E-тесты ключевых сценариев (Playwright)
- [ ] README: функционал, зависимости, установка, запуск тестов
