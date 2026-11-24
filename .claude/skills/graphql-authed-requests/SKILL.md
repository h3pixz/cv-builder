---
name: graphql-authed-requests
description: Use when writing server-side GraphQL queries or mutations against the CV Builder backend, handling access/refresh tokens, 401 retries or re-authentication, or debugging "Cannot read properties of undefined (reading 'toString')" in the request layer.
---

# GraphQL requests with auto re-auth

Backend schema highlights: `login(auth)`, `updateToken` (returns `access_token` + `refresh_token`), `users(params: SearchPaginationInput)`, `user(userId)`, `updateUser`, `updateProfile`, `uploadAvatar(avatar: {userId, base64, size, type})`, `sendVerification(email)`, `deleteUser(userId)`. Pagination type: `{ items, total, page, limit, total_pages }`.

## Flow
- `shared/api/graphql/graphql.ts` — `gqlRequest`, отправляет `Authorization: Bearer <token>` и `Origin`.
- `shared/api/authed-request/authed-request.ts` — `authedGqlRequest` (Server Components) и `authedGqlRequestWithRefresh` (Server Actions): при `unauthorized` вызывают `updateToken` с refresh-токеном и повторяют запрос один раз.
- `shared/api/protected/protected.ts` — `protectedRequest`: берёт сессию из cookie, без сессии редиректит на страницу входа.
- `shared/api/run-authed.ts` — `runAuthed` для Server Actions пользователей, профиля и CV: сессия + refresh-ретрай + `ActionResult`.
- `src/proxy.ts` — обновляет пару токенов до рендера страницы; это основной путь refresh, ретраи в рендере — запасной.

Use stored credentials only in a flow where the user just typed them or for a service account from env. Never store raw passwords in cookies or storage.

## Cookie rules
- `cookies().set()` works only in Server Actions, Route Handlers and `middleware.ts`/`proxy.ts`. It throws in Server Component render.
- Refresh tokens in `middleware.ts`/`proxy.ts` before the page renders; `authedRequest` renewal during render is only a fallback.
- If refresh tokens rotate, dedupe concurrent refreshes with one in-flight promise.

## Debugging "reading 'toString'" in fetch
Most likely causes, in order:
1. The URL env var is undefined (`process.env.X!` hides it). Validate with an explicit throw; restart `next dev` after editing `.env*`.
2. `query` is not a string (a `TypedDocumentNode` or undefined constant was passed). Use `print(doc)` or a template string.
3. `session.access_token` / `refresh_token` are undefined. Log the session.

## Checklist
- [ ] Env var name matches the existing client
- [ ] Reads wrapped in `cache()`; mutations are Server Actions
- [ ] Renewed tokens persisted only from an action/route handler/middleware
