!USER LANGUAGES.jpg

## Purpose

Allows viewing and managing user languages.

The available functionality depends on:

- current user's role
- whose profile is being viewed

### Employee

### Viewing Own Profile

Can:

- View languages
- Add languages
- Update language proficiency
- Remove languages

### Viewing Another User Profile

Can:

- View languages only

Cannot:

- Add languages
- Update languages
- Remove languages

### Admin

Can:

- View languages
- Add languages
- Update languages
- Remove languages

for any user profile.

---

## Scope

The Languages tab is available on the User Details page.

The tab is available for:

- Admin
- Employee

Role-based permissions apply.

---

## Behavior

The page allows users to:

- View assigned languages
- View language proficiency levels

Depending on permissions, users may also:

- Add languages
- Edit language proficiency
- Remove languages

---

## Design Reference

Figma: CV Builder – User Details – Languages

---

## Layout

Page must follow the User Details layout structure.

The Languages tab is displayed inside the User Details page.

Requirements:

- Languages are displayed under a single section
- Section title: `Current Languages`
- Layout must be responsive across desktop and tablet devices
- Supports Light and Dark themes

---

## Navigation

The Languages tab is available from:

`Languages`

Requirements:

- Active tab must be visually highlighted
- Tab state must persist after page refresh when possible

---

## Content

### Current Languages

The page displays all languages assigned to the selected user.

Each language displays:

- Language Name
- Language Proficiency Level

Available proficiency levels:

- A1
- A2
- B1
- B2
- C1
- C2
- Native

Requirements:

- Languages are displayed in a consistent format
- Proficiency level is clearly visible

---

## Permissions

### Employee Viewing Own Profile

Available actions:

- Add Language
- Update Language
- Remove Languages

---

### Employee Viewing Another User Profile

Available actions:

- View languages

Restricted actions:

- Add Language
- Update Language
- Remove Languages

Requirements:

- Management buttons must not be displayed
- Language items must not be editable
- Clicking a language does not open the Update Language modal

---

### Admin Viewing Any Profile

Available actions:

- Add Language
- Update Language
- Remove Languages

Requirements:

- Functionality is identical regardless of whose profile is being viewed

---

## Add Language

### Trigger

Opened from:

`ADD LANGUAGE`

Requirements:

- Available for the profile owner
- Available for Admin users
- Hidden for Employees viewing another user's profile

---

### Add Language Modal

### Content

Title:

`Add language`

Fields:

### Language

Select field

Requirements:

- Required
- Displays available languages
- Already assigned languages must not be available for selection

---

### Language Proficiency

Select field

Available values:

- A1
- A2
- B1
- B2
- C1
- C2
- Native

Requirements:

- Required

---

### Validation

Validation messages must be displayed inline.

Rules:

- Language is required
- Language proficiency is required

Example messages:

- `Language is required`
- `Language proficiency is required`

---

### Actions

Buttons:

- `CANCEL`
- `ADD`

Requirements:

- `ADD` remains disabled until all required fields are valid
- Successful creation adds the language to the list
- Modal closes after successful creation

---

## Update Language

### Trigger

Opened by clicking a language item.

Available for:

- Profile owner
- Admin

Not available for:

- Employees viewing another user's profile

---

### Update Language Modal

### Content

Title:

`Update language`

Fields:

### Language

Select field

Requirements:

- Disabled
- Displays currently selected language

---

### Language Proficiency

Select field

Available values:

- A1
- A2
- B1
- B2
- C1
- C2
- Native

Requirements:

- Required

---

### Validation

Validation messages must be displayed inline.

Rules:

- Language proficiency is required

Example message:

- `Language proficiency is required`

---

### Actions

Buttons:

- `CANCEL`
- `SAVE`

Requirements:

- `SAVE` updates the selected language
- Modal closes after successful update
- Updated value appears immediately on the page

---

## Remove Languages

### Trigger

Opened from:

`REMOVE LANGUAGES`

Requirements:

- Available for the profile owner
- Available for Admin users
- Hidden for Employees viewing another user's profile

---

### Selection Mode

Clicking `REMOVE LANGUAGES` enables selection mode.

Requirements:

- Multiple languages can be selected
- Selected languages are visually highlighted
- Selected count is displayed on the Remove button

Example:

`REMOVE (3)`

---

### Actions

Buttons:

- `CANCEL`
- `REMOVE`

Requirements:

- `REMOVE` is disabled when no languages are selected
- `REMOVE` opens the confirmation modal

---

## Remove Languages Modal

### Trigger

Opened from:

`REMOVE`

---

### Content

Title:

`Remove languages`

Message:

`Are you sure you want to remove {count} languages?`

Where:

- `{count}` = number of selected languages

---

### Actions

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- `CANCEL` closes the modal without changes
- `CONFIRM` removes the selected languages
- Languages are removed immediately after successful operation
- Modal closes after successful removal
- Selection mode exits automatically

---

## States

### Loading State

Displayed while languages are being loaded.

Requirements:

- Languages section remains visible when possible
- Loading indicators or skeletons are displayed

---

### Empty State

Displayed when the user has no assigned languages.

Example message:

`No languages added yet`

Requirements:

- Empty state is displayed instead of the language list

---

### Error State

Displayed when languages cannot be loaded.

Requirements:

- Error message is shown
- Retry action is available

Example:

`Failed to load languages`

---

## Validation & Error Handling

Requirements:

- Failed create requests must display a system error
- Failed update requests must display a system error
- Failed delete requests must display a system error
- Validation errors must be displayed inline
- Failed requests must not clear entered values

---

## Accessibility & Responsiveness

Requirements:

- Full keyboard navigation support
- Visible focus states
- Accessible labels for form controls
- Modal dialogs must trap keyboard focus
- Escape key closes modals
- Content remains readable in Light and Dark themes
- Layout scales correctly across supported screen sizes

---

## Acceptance Criteria

| ID    | Description                                                    |
| ----- | -------------------------------------------------------------- |
| AC-1  | Languages tab is available on the User Details page            |
| AC-2  | Languages are displayed under the Current Languages section    |
| AC-3  | Users can view assigned languages and proficiency levels       |
| AC-4  | Employees can manage languages only on their own profile       |
| AC-5  | Employees viewing another user's profile have read-only access |
| AC-6  | Admins can manage languages on any user profile                |
| AC-7  | ADD LANGUAGE action opens Add Language modal                   |
| AC-8  | Language and Language Proficiency fields are required          |
| AC-9  | Successfully adding a language updates the page immediately    |
| AC-10 | Clicking a language opens Update Language modal when permitted |
| AC-11 | Language field is disabled during update                       |
| AC-12 | Successfully updating a language refreshes displayed data      |
| AC-13 | REMOVE LANGUAGES action enables selection mode                 |
| AC-14 | Multiple languages can be selected for removal                 |
| AC-15 | Remove action opens confirmation modal                         |
| AC-16 | Confirming removal deletes selected languages                  |
| AC-17 | Loading, Empty, and Error states are supported                 |
| AC-18 | Validation errors are displayed inline                         |
| AC-19 | Page supports Light and Dark themes                            |
| AC-20 | Page is responsive across supported devices                    |
| AC-21 | Keyboard accessibility is fully supported                      |
