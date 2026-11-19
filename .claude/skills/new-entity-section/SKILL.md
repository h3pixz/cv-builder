---
name: new-entity-section
description: Use when adding a new entity area to the CV Builder app (e.g. skills, languages, CVs, departments, positions, projects) with a table page and optionally per-item tabs. A scaffold recipe based on the Employees section.
---

# Scaffold a new entity section

Template: the Employees section (`/users`, `/users/[userId]/profile|skills|languages|cvs`).

## Steps
1. Read the entity's operations in the GraphQL schema (list query with `SearchPaginationInput`, single query, create/update/delete mutations).
2. Create `features/<entity>/` per the `fsd-nextjs` skill: `index.ts`, `api/<entity>.queries.ts`, `api/<entity>.mutations.ts`, `api/<entity>.actions.ts`, `model/` (record, zod schema, permissions), `ui/`.
3. List page: `<Entity>Page({ search })` with an unkeyed `<Suspense>` around `<Toolbar />` and a `key={search}` Suspense around the async list. Toolbar is a client component with a debounced `router.replace` and removes the param when empty.
4. Table: `<Entity>Table` with a last-column `<Entity>ActionsMenu` (client dropdown: View / Update / Delete; Delete calls a Server Action then revalidates).
5. Routes under `app/(platform)/<entity>/page.tsx` following `nextjs-runtime-data` (sync page, inner async component in Suspense).
6. Detail routes only if needed: `[id]/layout.tsx` (breadcrumbs + tabs), `[id]/page.tsx` redirect (or `next.config` redirect), one folder per tab.
7. Add the entry to `widgets/sidebar` navigation arrays; the active state uses `startsWith(href + "/")`.
8. Export everything the routes use from `features/<entity>/index.ts`.

## Entity notes
- Skills: `skills`, `skillCategories`, `createSkill(name, categoryId)`; per-user skills use `addProfileSkill` / `updateProfileSkill` / `deleteProfileSkill` with `Mastery` (Novice, Advanced, Competent, Proficient, Expert).
- Languages: per-user via `addProfileLanguage` with `Proficiency` (A1..C2, Native).
- CVs: `cvsByUserId(userId)`, `createCv`, `updateCv`, `exportPdf`; projects and skills attach via `addCvProject`, `addCvSkill`.
- Departments, Positions, Projects: simple CRUD with pagination.

## Done when
- [ ] No blocking-prerender errors in dev
- [ ] Search works without losing input focus
- [ ] Row menu navigates and Delete revalidates the list
