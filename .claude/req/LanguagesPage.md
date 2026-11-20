!LANGUAGES.jpg

## Purpose

Allows users to manage their personal language knowledge and proficiency levels.

---

## Scope

This page is available for both **User** and **Admin** roles when managing their own profile languages.

This specification describes the **User Languages page** only.

Administrative language management is covered by a separate page.

---

## Behavior

The page allows users to:

- View assigned languages
- View language proficiency levels
- Add new languages
- Edit existing languages
- Select multiple languages for removal
- Remove selected languages after confirmation

---

## Design Reference

Figma: CV Builder – Languages (User)

---

## Layout

- Page must follow the standard application layout
- Sidebar navigation remains visible and accessible
- Languages are displayed within a single section
- Supports Light and Dark themes
- Fully responsive on desktop and tablet devices

---

## Content

### Navigation

The page includes:

- Logo with application name
- Sidebar navigation
- User profile section

---

### Current Languages

Section title:

`Current Languages`

Requirements:

- Displays all assigned languages
- Each language displays its proficiency level
- Languages must be visually separated and easily identifiable

---

### Language Item

Each language displays:

- Language name
- Language proficiency

Examples:

- English — C1
- German — B2
- French — Native

Requirements:

- Language item must support selection mode
- Language item must support editing

---

### Add Language Action

Button:

`ADD LANGUAGE`

Requirements:

- Opens Add Language modal
- Available when not in removal mode
- Supports:
  - default
  - hover
  - pressed
  - disabled states

---

### Remove Languages Action

Button:

`REMOVE LANGUAGES`

Requirements:

- Activates language selection mode
- Allows selecting multiple languages
- Selected languages must be visually highlighted
- Button changes to removal action when at least one language is selected

Examples:

- `REMOVE (1)`
- `REMOVE (3)`
- `REMOVE (5)`

Requirements:

- Count reflects the number of selected languages
- Cancel action exits selection mode and clears selected items

---

## Add Language Modal

Title:

`Add language`

Fields:

### Language

Select field containing available languages.

Requirements:

- Required field
- Displays available languages
- Supports dropdown selection

### Language Proficiency

Select field containing proficiency levels.

Requirements:

- Required field
- Displays available proficiency options

Available values:

- A1
- A2
- B1
- B2
- C1
- C2
- Native

---

### Actions

Buttons:

- `CANCEL`
- `ADD`

Requirements:

- Add button remains disabled until all required fields are completed
- Cancel closes modal without saving changes
- Add creates a new language and updates the list

---

## Edit Language Modal

Title:

`Edit language`

Fields:

### Language

Requirements:

- Displays selected language
- Read-only (disabled)
- Cannot be changed

### Language Proficiency

Requirements:

- Editable
- Allows updating proficiency level

Available values:

- A1
- A2
- B1
- B2
- C1
- C2
- Native

---

### Actions

Buttons:

- `CANCEL`
- `SAVE`

Requirements:

- Save updates language proficiency
- Cancel closes modal without changes

---

## Remove Languages Confirmation Modal

Title:

`Remove language`

Message:

`Are you sure you want to remove {count} languages?`

Examples:

- Are you sure you want to remove 1 language?
- Are you sure you want to remove 3 languages?

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- Cancel closes modal without removing languages
- Confirm removes all selected languages
- Removed languages disappear from the list immediately after successful operation

---

## Validation & Error Handling

### Add/Edit Language Validation

- Language is required
- Language proficiency is required
- Duplicate languages must not be allowed

Example messages:

- `Language is required`
- `Language proficiency is required`
- `Language already exists`

### System Errors

- Failed create operation displays error message
- Failed update operation displays error message
- Failed delete operation displays error message
- Failed requests must not clear user input

---

## Accessibility & Responsiveness

- All text must remain readable in both themes
- Full keyboard navigation support is required
- Interactive elements must provide visible focus states
- Modals must trap keyboard focus while open
- Layout must scale correctly across supported screen sizes

---

## Acceptance Criteria

| ID    | Description                                         |
| ----- | --------------------------------------------------- |
| AC-1  | User can view assigned languages                    |
| AC-2  | Language proficiency is displayed for each language |
| AC-3  | User can open Add Language modal                    |
| AC-4  | User can add a new language                         |
| AC-5  | User can open Edit Language modal                   |
| AC-6  | Language field is disabled in Edit mode             |
| AC-7  | User can update language proficiency                |
| AC-8  | User can enter language removal mode                |
| AC-9  | Multiple languages can be selected for removal      |
| AC-10 | Selected languages are visually highlighted         |
| AC-11 | Remove action displays selected language count      |
| AC-12 | Confirmation modal is displayed before removal      |
| AC-13 | Confirm removes selected languages                  |
| AC-14 | Validation messages are displayed for invalid input |
| AC-15 | Duplicate languages cannot be added                 |
| AC-16 | Page supports Light and Dark themes                 |
| AC-17 | Page is responsive across supported devices         |
