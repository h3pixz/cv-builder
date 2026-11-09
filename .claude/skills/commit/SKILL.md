---
name: commit
description: Create git commits following the project rules. Use when the user asks to commit, or to split changes into commits.
---

Базовые правила — в `CLAUDE.md`, раздел «Коммиты». Перед фиксацией пройди чек-лист.

1. Разбей работу
   - Одна логическая правка — один коммит; фичу, рефакторинг и форматирование не смешивать.
   - Каждый коммит должен собираться сам по себе. Перед фиксацией: `npx tsc --noEmit` и `npm run build`.
   - Коммит создаётся только по просьбе пользователя. Если просьбы нет — предложи разбивку и подожди.

2. Сообщение
   - Conventional Commits на английском: `type(scope): summary` (`feat(resume-form): ...`, `fix(apollo): ...`, `refactor(layout): ...`, `test(store): ...`).
   - В теле — почему изменение сделано, а не пересказ диффа.
   - Не добавляй `Co-Authored-By: Claude ...` и любые другие подписи об авторстве — ни в заголовок, ни в тело коммита.

3. Перед коммитом
   - Посмотри `git status` и `git diff --cached`: не попадают ли `.env`, `.next/`, `coverage/`, `node_modules/`, посторонние файлы.
   - Стейджи конкретные файлы, а не `git add -A`.
   - Пуш в `origin` — только по явной просьбе.
