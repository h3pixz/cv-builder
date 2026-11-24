---
name: nextjs-runtime-data
description: Use when writing or editing Next.js App Router layouts, pages, loading states or client components that read params, searchParams, cookies(), headers(), usePathname() or useSearchParams(). Prevents "blocking-prerender" errors with Cache Components.
---

# Runtime data and Suspense (Next.js, Cache Components)

Runtime data is anything only known per request. Reading it outside `<Suspense>` fails the build/dev with "Next.js encountered runtime data during prerendering".

## What counts as runtime data
- Server: `await params`, `await searchParams`, `cookies()`, `headers()`, and anything that calls them (e.g. `getSession()`).
- Client: `usePathname()`, `useSearchParams()`, `useParams()`.

## Rules
1. Route files (`page.tsx`, `layout.tsx`) stay **synchronous**. They receive `params` / `searchParams` as Promises and pass the Promise down. They never `await` at the top level.
2. The `await` happens in an inner async component wrapped in `<Suspense>`.
3. Auth (`getSession()`) goes in an async `AuthGate` component under `<Suspense>`, never at the top of a layout body. Keep the real redirect in `middleware.ts` / `proxy.ts` too.
4. A client component that calls `usePathname()` / `useSearchParams()` must be rendered under `<Suspense>`. Isolate the hook in a tiny component, and use a hook-free render of the same markup as the fallback so the shell is not empty.
5. `key={search}` on a Suspense boundary remounts its children. Never put an input/toolbar inside a keyed boundary. Key only the data list.
6. `useSelectedLayoutSegment()` is also URL-dependent: wrap the tabs in Suspense if the compiler complains.

## Patterns

Page:
```tsx
type Props = { params: Promise<{ userId: string }> };

async function Content({ params }: Props) {
  const { userId } = await params;
  return <UserProfilePage userId={userId} />;
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <Content params={params} />
    </Suspense>
  );
}
```

Async component that only redirects must be typed `Promise<never>`:
```tsx
async function Redirector({ params }: Props): Promise<never> {
  const { userId } = await params;
  redirect(`/users/${userId}/profile`);
}
```
Prefer `redirects()` in `next.config.ts` when the redirect needs no user state.

## Checklist before finishing
- [ ] No top-level `await params/searchParams/cookies()` in a route file or layout body
- [ ] Every runtime read has a `<Suspense>` ancestor
- [ ] Fallbacks have a fixed height to avoid layout jumps
- [ ] Searched/filtered lists key on the search value; toolbars do not
