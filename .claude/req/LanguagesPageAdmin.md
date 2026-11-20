!LANGUAGES (ADMIN).png.png)

## Purpose

Allows administrators to manage the global list of languages available throughout the application.

Administrators can:

- View all available languages
- Search languages
- Sort languages
- Create new languages
- Edit existing languages
- Delete languages

---

## Scope

This page is available only to users with the **Admin** role.

Users without Admin permissions must not have access to this page.

---

## Behavior

The page allows administrators to:

- View a paginated list of languages
- Search languages by name
- Sort languages
- Create new languages
- Edit existing languages
- Delete existing languages
- Navigate through pages of results

---

## Design Reference

Figma: CV Builder – Languages (Admin)

---

## Layout

- Page must follow the standard application layout structure
- Sidebar navigation remains visible and accessible
- Languages content is displayed in the main content area
- Layout must be fully responsive across desktop and tablet devices
- Supports Light and Dark themes

---

## Navigation

### Sidebar

The following navigation item is visible only for Admin users:

- `Languages`

Requirements:

- Selecting the navigation item opens the Languages page
- Active navigation item must be visually highlighted
- Navigation state must persist during page refresh

---

## Content

### Page Header

The page contains:

- Back navigation button
- Page title: `Languages`
- Search field
- Create action button

---

### Search

Search field placeholder:

`Search`

Requirements:

- Filters languages by name
- Search is case-insensitive
- Search updates results without page reload
- Empty search displays all available languages

---

### Create Language Action

Button:

`CREATE LANGUAGE`

Requirements:

- Visible only for Admin users
- Opens Create Language modal
- Supports:
  - default
  - hover
  - pressed states

---

### Languages Table

The table displays the following columns:

| Column      | Description          |
| ----------- | -------------------- |
| Name        | Language name        |
| ISO         | ISO language code    |
| Native Name | Native language name |

Examples:

| Name      | ISO | Native Name |
| --------- | --- | ----------- |
| English   | EN  | English     |
| German    | DE  | Deutsch     |
| Ukrainian | UK  | Українська  |

Requirements:

- Data is displayed in tabular format
- Supports sorting by Name and ISO
- Supports pagination
- Supports empty state
- Supports loading state
- Supports error state

---

### Row Actions

Each row contains an action menu represented by a three-dot icon.

Clicking the menu opens a contextual menu containing:

- `Edit`
- `Delete`

Requirements:

- Menu opens near the selected row
- Only one menu may be open at a time
- Menu closes when:
  - clicking outside
  - selecting an action
  - pressing Escape

---

## Create Language Modal

### Trigger

Opened from:

`CREATE LANGUAGE`

### Content

Title:

`Create language`

Fields:

### Name

Input field:

`Name`

Requirements:

- Required field
- Supports:
  - default
  - focus
  - error
  - disabled states

### ISO

Input field:

`ISO`

Example:

`EN`

Requirements:

- Required field
- Accepts language ISO code
- Value is automatically converted to uppercase
- Maximum length: 2 characters
- Supports:
  - default
  - focus
  - error
  - disabled states

### Native Name

Input field:

`Native Name`

Requirements:

- Required field
- Supports:
  - default
  - focus
  - error
  - disabled states

---

### Validation

Validation messages must be displayed inline.

Rules:

- Name is required
- ISO is required
- Native Name is required
- Duplicate language names are not allowed
- Duplicate ISO codes are not allowed

Example messages:

- `Name is required`
- `ISO is required`
- `Native name is required`
- `Language already exists`
- `ISO code already exists`

---

### Actions

Buttons:

- `CANCEL`
- `CREATE`

Requirements:

- CREATE remains disabled until all required fields are valid
- Successful creation updates the languages table
- Modal closes after successful creation

---

## Edit Language Modal

### Trigger

Opened from:

`Edit`

### Content

Title:

`Edit language`

Fields:

- Name
- ISO
- Native Name

Requirements:

- Existing values are prefilled
- Same validation rules as Create Language

---

### Actions

Buttons:

- `CANCEL`
- `SAVE`

Requirements:

- SAVE updates the selected language
- Modal closes after successful update
- Updated data appears immediately in the table

---

## Delete Language Modal

### Trigger

Opened from:

`Delete`

### Content

Title:

`Delete language`

Message:

`Are you sure you want to delete language {name}?`

Where:

- `{name}` = selected language name

---

### Actions

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- CANCEL closes the modal without changes
- CONFIRM deletes the selected language
- Deleted language is removed from the table immediately
- Modal closes after successful deletion

---

## Pagination

Requirements:

- Available when results exceed page size
- Allows navigation between pages
- Current page must be visually highlighted
- Search and sorting must work together with pagination

---

## States

### Loading State

Displayed while languages are being loaded.

Requirements:

- Table remains visible
- Loading indicator is displayed

---

### Empty State

Displayed when no languages exist or search returns no results.

Example message:

`No languages found`

---

### Error State

Displayed when data cannot be loaded.

Requirements:

- Error message is shown
- Retry action is available

---

## Validation & Error Handling

- Failed create requests must display a system error
- Failed update requests must display a system error
- Failed delete requests must display a system error
- Validation errors must be displayed inline
- Failed requests must not clear entered values

---

## Accessibility & Responsiveness

- Full keyboard navigation support is required
- Interactive elements must provide visible focus states
- Form controls must include accessible labels
- Modal dialogs must trap keyboard focus
- Escape key closes action menus and modals
- Content must remain readable in both Light and Dark themes
- Layout must scale correctly across supported screen sizes

---

## Acceptance Criteria

| ID    | Description                                                 |
| ----- | ----------------------------------------------------------- |
| AC-1  | Languages page is accessible only for Admin users           |
| AC-2  | Languages navigation item is visible for Admin users        |
| AC-3  | Languages table displays Name, ISO, and Native Name columns |
| AC-4  | Search filters languages by name                            |
| AC-5  | Languages can be sorted by Name and ISO                     |
| AC-6  | Pagination is available when required                       |
| AC-7  | CREATE LANGUAGE button opens Create Language modal          |
| AC-8  | Administrator can create a new language                     |
| AC-9  | Language creation requires Name, ISO, and Native Name       |
| AC-10 | Duplicate language names are not allowed                    |
| AC-11 | Duplicate ISO codes are not allowed                         |
| AC-12 | Row action menu contains Edit and Delete actions            |
| AC-13 | Edit action opens Edit Language modal                       |
| AC-14 | Administrator can update an existing language               |
| AC-15 | Delete action opens Delete Language confirmation modal      |
| AC-16 | Confirming deletion removes the selected language           |
| AC-17 | Validation errors are displayed inline                      |
| AC-18 | Loading, Empty, and Error states are supported              |
| AC-19 | Page supports Light and Dark themes                         |
| AC-20 | Page is responsive across supported devices                 |
| AC-21 | Keyboard accessibility is fully supported                   |
