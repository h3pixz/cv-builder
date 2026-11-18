!USERS CVS.jpg

## Purpose

Allows administrators to manage CVs created for a specific employee.

The page displays only CVs belonging to the currently selected user.

### Admin

Can:

- View CVs
- Search CVs
- Sort CVs
- Open CV details
- Create CVs
- Update CVs
- Delete CVs

---

## Scope

The CVs tab is available on the User Details page.

The tab is available only for:

- Admin

---

## Behavior

The page allows administrators to:

- View CVs belonging to the selected employee
- Search CVs by name
- Sort CVs by name
- Open CV details
- Create CVs
- Update CVs
- Delete CVs

---

## Design Reference

Figma: CV Builder – User Details – CVs

---

## Layout

Page must follow the User Details layout structure.

The CVs tab is displayed inside the User Details page.

Requirements:

- Search field is displayed above the list
- Create CV action is displayed above the list
- CVs are displayed in a table layout
- Table supports sorting by Name
- Layout must be responsive across desktop and tablet devices
- Supports Light and Dark themes

---

## Navigation

The CVs tab is available from:

`CVs`

Requirements:

- Active tab must be visually highlighted
- Tab state must persist after page refresh when possible

---

## Content

### CV List

The page displays CV records belonging to the selected employee.

The table contains the following columns:

| Column    | Description        |
| --------- | ------------------ |
| Name      | CV name            |
| Education | CV education value |
| Employee  | Employee email     |

Requirements:

- Only CVs belonging to the selected employee are displayed
- Records are displayed in a tabular layout
- Each row displays a CV summary
- Each row contains an actions menu

---

### Search

Search field placeholder:

`Search`

Requirements:

- Searches by CV Name only
- Search is case-insensitive
- Search updates results without page reload
- Empty search displays all CVs

---

### Sorting

Supported sorting:

### Name

Requirements:

- Sorts alphabetically
- Supports ascending order
- Supports descending order
- Current sort direction is visually indicated

---

### Actions Menu

Each CV row contains an actions menu.

Available actions:

- `View`
- `Edit`
- `Delete`

Requirements:

- Actions menu is displayed for every CV row
- Only one menu may be open at a time
- Menu closes when:
  - clicking outside
  - selecting an action
  - pressing Escape

---

## View CV

### Trigger

Opened from:

`View`

Requirements:

- Opens the selected CV Details page

---

### Behavior

Requirements:

- User is redirected to the CV Details page
- Selected CV data is loaded
- Page displays full CV content

---

## Create CV

### Trigger

Opened from:

`CREATE CV`

Requirements:

- Available only for Admin users

---

### Create CV Modal

### Content

Title:

`Create CV`

Fields:

### Name

Text input

Requirements:

- Required
- Maximum length: 255 characters

---

### Education

Text input

Requirements:

- Required
- Maximum length: 255 characters

---

### Description

Textarea

Requirements:

- Required

---

### Validation

Validation messages must be displayed inline.

Rules:

- Name is required
- Education is required
- Description is required

Example messages:

- `Name is required`
- `Education is required`
- `Description is required`

---

### Actions

Buttons:

- `CANCEL`
- `CREATE`

Requirements:

- CREATE remains disabled until all required fields are valid
- Successful creation adds the CV to the list
- Modal closes after successful creation

---

## Update CV

### Trigger

Opened from:

`Edit`

Requirements:

- Available from the CV actions menu

---

### Update CV Modal

### Content

Title:

`Update CV`

Fields:

### Name

Text input

Requirements:

- Required
- Pre-populated with the current value

---

### Education

Text input

Requirements:

- Required
- Pre-populated with the current value

---

### Description

Textarea

Requirements:

- Required
- Pre-populated with the current value

---

### Validation

Validation messages must be displayed inline.

Rules:

- Name is required
- Education is required
- Description is required

Example messages:

- `Name is required`
- `Education is required`
- `Description is required`

---

### Actions

Buttons:

- `CANCEL`
- `SAVE`

Requirements:

- SAVE updates the selected CV
- Modal closes after successful update
- Updated values appear immediately in the list

---

## Delete CV

### Trigger

Opened from:

`Delete`

Requirements:

- Available from the CV actions menu

---

### Delete CV Modal

### Content

Title:

`Delete CV`

Message:

`Are you sure you want to delete CV {name}?`

Where:

- `{name}` = selected CV name

---

### Actions

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- CANCEL closes the modal without changes
- CONFIRM deletes the selected CV
- CV is removed from the list immediately after successful deletion
- Modal closes after successful deletion

---

## States

### Loading State

Displayed while CVs are being loaded.

Requirements:

- Table structure remains visible when possible
- Loading indicators or skeletons are displayed

---

### Empty State

Displayed when the selected employee has no CVs.

Example message:

`No CVs found`

Requirements:

- Empty state is displayed instead of table rows

---

### No Search Results State

Displayed when search returns no matches.

Example message:

`No CVs found`

Requirements:

- Search value remains visible

---

### Error State

Displayed when CVs cannot be loaded.

Requirements:

- Error message is shown
- Retry action is available

Example:

`Failed to load CVs`

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
- Escape key closes action menus and modals
- Content remains readable in Light and Dark themes
- Layout scales correctly across supported screen sizes

---

## Acceptance Criteria

| ID    | Description                                                         |
| ----- | ------------------------------------------------------------------- |
| AC-1  | CVs tab is available only for Admin users                           |
| AC-2  | Only CVs belonging to the selected employee are displayed           |
| AC-3  | CV list displays Name, Education, and Employee columns              |
| AC-4  | Search filters CVs by Name only                                     |
| AC-5  | Search is case-insensitive                                          |
| AC-6  | CV list supports sorting by Name                                    |
| AC-7  | Clicking View opens the CV Details page                             |
| AC-8  | CREATE CV opens Create CV modal                                     |
| AC-9  | Name, Education, and Description are required fields                |
| AC-10 | Successfully creating a CV updates the list immediately             |
| AC-11 | Edit action opens Update CV modal                                   |
| AC-12 | Update CV modal is pre-populated with existing values               |
| AC-13 | Successfully updating a CV refreshes displayed data                 |
| AC-14 | Delete action opens Delete CV modal                                 |
| AC-15 | Delete confirmation displays the selected CV name                   |
| AC-16 | Confirming deletion removes the CV from the list                    |
| AC-17 | Loading, Empty, No Search Results, and Error states are supported   |
| AC-18 | Validation errors are displayed inline                              |
| AC-19 | Page supports Light and Dark themes                                 |
| AC-20 | Page is responsive across supported devices                         |
| AC-21 | Keyboard accessibility is fully supported                           |
| AC-22 | Newly created CV is automatically assigned to the selected employee |
