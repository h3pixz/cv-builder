Implement the Projects admin page per .claude/req/projects.md. It includes a
text description of the design, since you can't view images.

Use the new-entity-section skill. Reference implementation: features/departments
(or features/languages if departments isn't merged yet): api/catalog._, model,
ui/admin/_, revalidate helper, thin route in app/(platform)/admin/projects.

Implement in this order and run `npm run typecheck` after each slice:

1. model + api (zod schema with limits: name 100, domain 100, description 2000,
   end >= start; Admin-only Server Actions; revalidate helper; codegen if needed)
2. shared/ui additions only if missing (tag chip, date input)
3. ui/admin: header with search and create button, list with 3 sortable columns,
   project block layout, actions menu, create/update/delete dialogs
4. thin route in app/(platform)/admin/projects + sidebar item (Admin-only, active state)
5. tests for schema, permissions and actions

Rules:

- Only shared/ui components and globals.css tokens. No hex colors, no inline styles.
- Chips must use break-words and wrap on tablet widths.
- Failed requests must keep the form values. Show inline errors with the exact
  messages from the spec.
- Don't touch unrelated code or the known /login redirect bug. Don't commit.
  Stop and ask only if typecheck fails twice on the same issue.
