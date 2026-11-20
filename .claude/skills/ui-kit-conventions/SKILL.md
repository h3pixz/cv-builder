---
name: ui-kit-conventions
description: Use when building or styling UI in this project (buttons, inputs, textareas, selects, checkboxes, labels, tables, pagination, dialogs, dropdown menus, avatars, breadcrumbs, levels, toasts, forms, tabs, sidebar). Documents every component in the ui folder with real props, import paths, gotchas and the visual style from the CV Builder mockups.
---

# UI kit conventions

All components are built on `@base-ui/react` (not Radix). Each lives in `shared/ui/<name>/` with an `index.ts` barrel.

## Imports
- Components: `import { Button } from "@/shared/ui/button"` (always the barrel, never the inner file).
- Class helper: `cn` is imported as `"cn"` in some files and `"@/lib/utils"` in others. Both are in use; stay consistent within a file.
- `Label` живёт в `shared/ui/label` (`import { Label } from "@/shared/ui/label"`). Папки `components/ui` нет — не создавай её.
- Base UI uses `render={<Link />}` where Radix uses `asChild`.

## button
`Button`, `buttonVariants`. Variants: `default` (text), `primary` (filled pill), `secondary` (outlined pill), `ghost`, `icon`. Base: `h-9 rounded-full px-6 text-[10px] font-semibold uppercase tracking-[0.02em]`. Add a variant instead of restyling per usage.

## input
`Input`, `inputVariants`, `PasswordInput`, `CodeInput`.
- `Input`: `forwardRef<HTMLInputElement>`, `h-8 rounded-none text-xs`, `variant`: `default` | `error`. Takes all native input props (`readOnly`, `defaultValue`, `name`). Never mix `defaultValue` and `value`. No built-in label or error text: render a `<label>` and error `<p className="text-xs text-destructive">` yourself.
- `PasswordInput`: same props plus show/hide toggle.
- `CodeInput`: OTP boxes. Props: `length` (6), `value` (digit string), `onChange(value)`, `onComplete(value)`, `variant`, `disabled`, `autoFocus` (true), `submitOnComplete` (true, calls `requestSubmit()` on the parent form).

## textarea
`Textarea`, `textareaVariants`. `forwardRef`, `min-h-20 resize-none text-xs`, `variant` `default` | `error`, also styles `aria-invalid`. No `"use client"` directive.

## label
`Label` — styled `<label>` на `React.ComponentProps<"label">`, `text-sm font-medium`, учитывает `disabled` у вложенного контрола. Используй вместо ручного `<label className=...>`.

## checkbox
`Checkbox` — обёртка над Base UI Checkbox. Принимает `CheckboxPrimitive.Root.Props` (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `name`). Рендерит свой индикатор, `data-slot="checkbox"`.

## select
Primitives in `select.tsx`: `Select` (Base UI Root), `SelectTrigger` (`size`: `default` | `sm`), `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectValue`, `SelectFieldShell`, `selectItemClassName`. Prefer the field wrappers below for forms.

### SelectField (single)
```tsx
<SelectField
  name="department"            // submitted with the form
  label="Department"           // floating label, appears once opened/selected
  placeholder="Department"     // also used as label when `label` is omitted
  options={departments.map((d) => ({ value: d.id, label: d.name }))}
  defaultValue={user.department?.id ?? null}   // uncontrolled
  // or value + onValueChange(value: string | null)   // controlled
  error={state.errors?.department}
  disabled required
/>
```
`SelectOption = { value: string; label: string; disabled?: boolean }`. Value is `string | null`.

### MultiselectField (multi)
Same props but `value` / `defaultValue` / `onValueChange` are `string[]`. Selected items render as removable chips; options show checkboxes. `display`: `chips` (по умолчанию) | `text` — в режиме `text` выбранные значения показываются одной строкой через `, `, без чипов (Roles в диалоге проекта).

Use these for Department, Position, mastery, proficiency and similar.

## dropdown-menu
Base UI Menu wrappers: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuShortcut`, `DropdownMenuPortal`.
- `DropdownMenuItem`: `variant` `default` | `destructive`, `inset`.
- `DropdownMenuContent`: `side`, `align` (default `start`), `sideOffset`, `alignOffset`. It is **as wide as its trigger** (`w-(--anchor-width)`), so for an icon trigger pass `className="w-auto min-w-32"` or it collapses to `min-w-32`.
- The trigger is a plain button; use `render` for your own.

Row actions menu:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="icon" aria-label="User actions" />}>
    <MoreVerticalIcon className="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-auto min-w-32">
    <DropdownMenuItem render={<Link href={`/users/${id}/profile`} />}>View</DropdownMenuItem>
    <DropdownMenuItem render={<Link href={`/users/${id}/profile`} />}>Update</DropdownMenuItem>
    <DropdownMenuItem variant="destructive" onClick={() => onDelete(id)}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
The file has `"use client"`, so a server component can render it, but handlers (`onClick`) must come from a client component.

## dialog
Base UI Dialog wrappers in `shared/ui/dialog`. `Dialog` (Root, controlled via `open` / `onOpenChange`), `DialogTrigger`, `DialogPortal`, `DialogBackdrop`, `DialogViewport`, `DialogContent` (portal + backdrop + viewport + popup), `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`.
- `DialogContent`: `className`, all `Dialog.Popup` props. Includes a top-right close button and centers the popup (`max-w-lg` by default).
- `Dialog` is modal by default (focus trap, Escape closes). Popup content unmounts when closed, so form state inside `DialogContent` resets on every open.
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create user</DialogTitle>
      <DialogDescription>...</DialogDescription>
    </DialogHeader>
    <form onSubmit={...}>
      ...
      <DialogFooter>
        <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button variant="primary" type="submit">Create</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

## table
Plain styled table primitives: `Table` (wraps in a scroll container), `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`. No sorting, selection or pagination built in. For a sortable column (e.g. Department with the arrow) build a client header button that updates `?sort_by=&sort_order=` and pass those to `SearchPaginationInput`.

## avatar
`Avatar` (`size`: `default` 32px | `sm` 24px | `lg` 40px; override with `className="size-24"` for the profile page), `AvatarImage`, `AvatarFallback` (gray circle, put the initial inside), `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`.
```tsx
<Avatar className="size-24">
  <AvatarImage src={url} alt="" />
  <AvatarFallback className="text-3xl">R</AvatarFallback>
</Avatar>
```

## breadcrumb
`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink` (supports `render={<Link href=... />}`), `BreadcrumbPage` (current, not a link), `BreadcrumbSeparator` (chevron by default), `BreadcrumbEllipsis`. Separators are `<li>` siblings inside `BreadcrumbList`, not inside items.

## toast
Base UI toast with a global manager.
1. Mount once in the root layout: `<Toaster />` (children необязательны; так он и подключён в `src/app/layout.tsx`).
2. Fire from anywhere on the client:
```tsx
import { toast } from "@/shared/ui/toast";

toast.add({ type: "success", title: "Success", description: "Profile updated" });
```
`type`: `success` | `error` | `warning` | `info` | `loading` (shows a spinner). Toasts appear bottom-right, with a close button. Call `toast.add` from a client component (e.g. in an effect reacting to a Server Action result), never from server code.
Other exports: `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastProvider`, `ToastViewport`, `createToastManager`, `useToastManager`.

## level
`Level` — шкала 0–5 на `role="meter"`. Props: `level: number` (округляется и зажимается в 0–5), `label?: string` (текст справа), `barClassName?: string` (переопределить полосу), плюс `HTMLAttributes<HTMLDivElement>` (`className`). Высота полосы `h-1`, ширина `w-34`, цвета уровней — токены `level-0..5-fill/track`. Для Mastery/Proficiency переводи значение в число через `masteryLevel` / `proficiencyLevel` из `@/shared/helpers` (`shared/helpers/levels.ts`).

## pagination
`ListPagination` из `shared/ui/pagination` — постраничная навигация для таблиц. Props: `page`, `totalPages`, `getHref(page)` (собирает URL и сохраняет остальные query-параметры), `label` (по умолчанию `"Pagination"`), `className`. При `totalPages <= 1` не рендерится. Также экспортирует `getPageItems` и тип `PageItem`; раскладка всегда 7 слотов, чтобы ширина не скакала.

## Tokens
Semantic classes only: `bg-background`, `text-foreground`, `text-muted-foreground`, `text-text-secondary`, `text-text-tertiary`, `border-control-border`, `bg-disabled`, `text-disabled-foreground`, `text-primary`, `bg-primary`, `border-destructive`, `bg-secondary-hover`, `bg-secondary-active`, `bg-success|error|warning|info`, `bg-sidebar`, `bg-sidebar-accent`, `border-sidebar-border`. No raw hex except the logo mark.

## Visual language (mockups)
- Light gray page, red primary accent; inputs are square (`rounded-none`), buttons are pills.
- Sidebar: `w-64`, collapsible to `w-20`, active item `bg-sidebar-accent rounded-r-full`, two groups separated by a border.
- Top tabs: uppercase `text-[10px]`, active = `border-b-2 border-primary text-primary`. Tabs are `Link`s using `useSelectedLayoutSegment()`; the URL is the source of truth.
- Profile page: centered column, 96px avatar + "Upload avatar image" with hint "png, jpg or gif no more than 5MB", name, email, "A member since <date>", two-column form (First Name, Last Name, Department, Position), `Verify email` (secondary) + `Update` (primary).

## Rules
- Forms start readonly/disabled when the action isn't wired.
- Format dates on the server to avoid hydration mismatches.
- Keep client components as leaves; fetch in server components.
- When adding a component to `ui/`, document its exports and props here.
