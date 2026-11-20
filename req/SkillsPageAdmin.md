!SKILLS (ADMIN).jpg.jpg)

## Purpose

Allows administrators to manage the global skills catalog used throughout the application.

Administrators can:

- View all available skills
- Search skills
- Sort skills
- Create new skills
- Edit existing skills
- Delete skills

---

## Scope

This page is available only to users with the **Admin** role.

Users without Admin permissions must not have access to this page.

---

## Behavior

The page allows administrators to:

- View a paginated list of skills
- Search skills by name
- Sort skills by name
- Create new skills
- Edit existing skills
- Delete existing skills
- Navigate through pages of results

---

## Design Reference

Figma: CV Builder – Skills (Admin)

---

## Layout

- Page must follow the standard application layout structure
- Sidebar navigation remains visible and accessible
- Skills content is displayed in the main content area
- Layout must be fully responsive across desktop and tablet devices
- Supports Light and Dark themes

---

## Navigation

### Sidebar

The following navigation item is visible only for Admin users:

- `Skills`

Requirements:

- Selecting the navigation item opens the Skills page
- Active navigation item must be visually highlighted
- Navigation state must persist during page refresh

---

## Content

### Page Header

The page contains:

- Back navigation button
- Page title: `Skills`
- Search field
- Create action button

---

### Search

Search field placeholder:

`Search`

Requirements:

- Filters skills by name
- Search is case-insensitive
- Search updates results without page reload
- Empty search displays all available skills

---

### Create Skill Action

Button:

`CREATE SKILL`

Requirements:

- Visible only for Admin users
- Opens Create Skill modal
- Supports:
  - default
  - hover
  - pressed states

---

### Skills Table

The table displays the following columns:

| Column   | Description    |
| -------- | -------------- |
| Name     | Skill name     |
| Type     | Skill type     |
| Category | Skill category |

Requirements:

- Data is displayed in tabular format
- Supports sorting by Name
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

## Create Skill Modal

### Trigger

Opened from:

`CREATE SKILL`

### Content

Title:

`Create skill`

Fields:

### Skill Name

Input field:

`Skill`

Requirements:

- Required field
- Supports:
  - default
  - focus
  - error
  - disabled states

### Category

Select field:

`Category`

Requirements:

- Required field
- Displays available skill categories
- Category determines the skill type automatically
- Type is not editable in the modal
- Supports:
  - default
  - focus
  - error
  - disabled states

---

### Validation

Validation messages must be displayed inline.

Rules:

- Skill name is required
- Category is required
- Duplicate skill names are not allowed

Example messages:

- `Skill is required`
- `Category is required`
- `Skill already exists`

---

### Actions

Buttons:

- `CANCEL`
- `CREATE`

Requirements:

- CREATE remains disabled until all required fields are valid
- Successful creation updates the skills table
- Modal closes after successful creation

---

## Edit Skill Modal

### Trigger

Opened from:

`Edit`

### Content

Title:

`Edit skill`

Fields:

- Skill Name
- Category

Requirements:

- Existing values are prefilled
- Same validation rules as Create Skill
- Category may be changed
- Skill type updates automatically based on selected category

---

### Actions

Buttons:

- `CANCEL`
- `SAVE`

Requirements:

- SAVE updates the selected skill
- Modal closes after successful update
- Updated data appears immediately in the table

---

## Delete Skill Modal

### Trigger

Opened from:

`Delete`

### Content

Title:

`Delete skill`

Message:

`Are you sure you want to delete skill {name}?`

Where:

- `{name}` = selected skill name

---

### Actions

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- CANCEL closes the modal without changes
- CONFIRM deletes the selected skill
- Deleted skill is removed from the table immediately
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

Displayed while skills are being loaded.

Requirements:

- Table remains visible
- Loading indicator is displayed

---

### Empty State

Displayed when no skills exist or search returns no results.

Example message:

`No skills found`

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

| ID    | Description                                            |
| ----- | ------------------------------------------------------ |
| AC-1  | Skills page is accessible only for Admin users         |
| AC-2  | Skills navigation item is visible for Admin users      |
| AC-3  | Skills table displays Name, Type, and Category columns |
| AC-4  | Search filters skills by name                          |
| AC-5  | Skills can be sorted by Name                           |
| AC-6  | Pagination is available when required                  |
| AC-7  | CREATE SKILL button opens Create Skill modal           |
| AC-8  | Administrator can create a new skill                   |
| AC-9  | Skill creation requires Name and Category              |
| AC-10 | Category automatically determines skill Type           |
| AC-11 | Row action menu contains Edit and Delete actions       |
| AC-12 | Edit action opens Edit Skill modal                     |
| AC-13 | Administrator can update an existing skill             |
| AC-14 | Delete action opens Delete Skill confirmation modal    |
| AC-15 | Confirming deletion removes the selected skill         |
| AC-16 | Validation errors are displayed inline                 |
| AC-17 | Loading, Empty, and Error states are supported         |
| AC-18 | Page supports Light and Dark themes                    |
| AC-19 | Page is responsive across supported devices            |
| AC-20 | Keyboard accessibility is fully supported              |
