---
name: fsd-nextjs
description: Use when adding or moving code in a Next.js project that follows Feature-Sliced Design (app/, widgets/, features/, shared/). Defines where routes, UI, server queries and actions live and what may import what.
---

# FSD + Next.js App Router

## Layers (top imports from below only)
`app` -> `widgets` -> `features` -> `shared`

`entities`, `views` и `store` пока не созданы: доменные сущности живут в `features/<name>/model`, композиция страниц — в `features/<name>/ui`.

- `app/` : Next.js routing only. Thin route files that read params and render a component from `features/*` or `widgets/*`. No business logic, no GraphQL.
- `widgets/` : composite UI blocks used by layouts (e.g. `sidebar`).
- `features/<name>/` : one user-facing feature with its backend logic.
- `shared/` : api client, session, ui kit, utils. Imports nothing above it.

A slice may never import from a slice in the same layer or from a higher layer.

## Feature slice structure
```
features/users/
├─ index.ts            # public API; the only import path other layers use
├─ api/
│  ├─ users.queries.ts # `import "server-only"`; reads, wrapped in React cache()
│  ├─ users.mutations.ts # thin GraphQL mutations
│  └─ users.actions.ts # "use server"; validation + permissions + revalidatePath
├─ model/              # records, zod schemas, permissions
└─ ui/                 # server + client components
```

## Rules
1. Other layers import only from `@/features/users` (the `index.ts`), never deep paths.
2. Queries: `import "server-only"`, wrap reads that several components call in `cache()`.
3. Mutations are Server Actions in `api/*.actions.ts`; after success call `revalidatePath`/`revalidateTag`.
4. Server components fetch; client components (`"use client"`) are leaves for interaction: forms, dropdowns, tabs, upload.
5. Map API types to UI records in `model/<entity>-record.ts` (см. `users/model/user-record.ts`); UI не использует сгенерированные GraphQL-типы там, где нужна доменная модель.
6. Nested route groups: `app/(platform)/layout.tsx` = shell (aside + auth gate); `app/(platform)/users/[userId]/layout.tsx` = section shell (breadcrumbs + tabs). Each layout renders `children` as its outlet.
7. Tab pages: `[userId]/<tab>/page.tsx` -> `<User<Tab>Page userId={userId} />` exported from the feature.

## Checklist
- [ ] Route file is under ~15 lines of real logic
- [ ] New exports added to `features/<name>/index.ts`
- [ ] No upward or sideways imports
