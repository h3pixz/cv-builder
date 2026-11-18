# Users Page

!USERS (ADMIN).jpg.jpg)

## Purpose

Allows users to view employee information within the organization.

The page behavior differs depending on the user's role:

### Employee

Can:

- View employees list
- Search employees
- Sort employees
- Open employee details

### Admin

Can:

- View employees list
- Search employees
- Sort employees
- Create users
- Update users
- Delete users
- Open employee details

---

## Scope

This page is available for both **Admin** and **Employee** roles.

Role-based permissions apply.

---

## Behavior

The page allows users to:

- View a paginated list of employees
- Search employees
- Sort employees
- Open employee profiles

Additionally, Admin users can:

- Create new users
- Edit existing users
- Delete users

---

## Design Reference

Figma: CV Builder – Users

---

## Layout

- Page must follow the standard application layout structure
- Sidebar navigation remains visible and accessible
- Users content is displayed in the main content area
- Layout must be fully responsive across desktop and tablet devices
- Supports Light and Dark themes

---

## Navigation

### Sidebar

The page is available through:

- `Employees`

Requirements:

- Navigation item is visible for both Admin and Employee roles
- Active navigation item must be visually highlighted
- Navigation state must persist during page refresh

---

## Content

### Page Header

The page contains:

- Back navigation button
- Page title: `Employees`
- Search field

Additionally, for Admin users:

- `CREATE USER` button

---

### Search

Search field placeholder:

`Search`

Requirements:

- Filters employees by:
  - First Name
  - Last Name
  - Email
- Search is case-insensitive
- Search updates results without page reload
- Empty search displays all employees

---

### Create User Action (Admin Only)

Button:

`CREATE USER`

Requirements:

- Visible only for Admin users
- Opens Create User modal
- Supports:
  - default
  - hover
  - pressed
  - disabled states

---

### Users Table

The table displays the following columns:

| Column     | Description             |
| ---------- | ----------------------- |
| Avatar     | User avatar or initials |
| First Name | User first name         |
| Last Name  | User last name          |
| Email      | User email              |
| Department | Assigned department     |
| Position   | Assigned position       |

Requirements:

- Data is displayed in tabular format
- Supports sorting by:
  - First Name
  - Last Name
  - Department
  - Position
- Supports pagination
- Supports empty state
- Supports loading state
- Supports error state

---

### User Actions

### Employee Role

Each row contains:

- Navigation icon

Requirements:

- Clicking the icon opens User Details page
- No edit or delete actions are available

---

### Admin Role

Each row contains a three-dot action menu.

Clicking the menu opens:

- `View`
- `Update`
- `Delete`

Requirements:

- Menu opens near the selected row
- Only one menu may be open at a time
- Menu closes when:
  - clicking outside
  - selecting an action
  - pressing Escape

---

## View User

### Trigger

Available for:

- Employee role
- Admin role

Opened from:

- Navigation arrow
- View action

Requirements:

- Opens User Details page
- Displays full user information

---

## Create User Modal

### Trigger

Opened from:

`CREATE USER`

---

### Content

Title:

`Create user`

Fields:

### Email

Input field:

`Email`

Requirements:

- Required field
- Must contain a valid email address

---

### Password

Input field:

`Password`

Requirements:

- Required field
- Masked by default
- Includes visibility toggle
- Minimum length: 6 characters

---

### First Name

Input field:

`First Name`

Requirements:

- Required field

---

### Last Name

Input field:

`Last Name`

Requirements:

- Required field

---

### Department

Select field:

`Department`

Requirements:

- Required field
- Displays available departments

---

### Position

Select field:

`Position`

Requirements:

- Required field
- Displays available positions

---

### Role

Select field:

`Role`

Available values:

- `Admin`
- `Employee`

Requirements:

- Required field

---

### Validation

Validation messages must be displayed inline.

Rules:

- Email is required
- Email must be valid
- Password is required
- Password must contain at least 6 characters
- First Name is required
- Last Name is required
- Department is required
- Position is required
- Role is required

Example messages:

- `Email is required`
- `Invalid email address`
- `Password is required`
- `Password must contain at least 6 characters`
- `First name is required`
- `Last name is required`
- `Department is required`
- `Position is required`
- `Role is required`

---

### Actions

Buttons:

- `CANCEL`
- `CREATE`

Requirements:

- CREATE remains disabled until all required fields are valid
- Successful creation adds the user to the table
- Modal closes after successful creation

---

## Update User Modal

### Trigger

Opened from:

`Update`

---

### Content

Title:

`Update user`

Fields:

- Email
- Password
- First Name
- Last Name
- Department
- Position
- Role

Requirements:

- Existing values are prefilled
- Email field is disabled
- Password field is disabled
- Department can be changed
- Position can be changed
- Role can be changed

---

### Validation

Validation rules are identical to Create User except disabled fields are excluded from validation.

---

### Actions

Buttons:

- `CANCEL`
- `SAVE`

Requirements:

- SAVE updates the selected user
- Modal closes after successful update
- Updated data appears immediately in the table

---

## Delete User Modal

### Trigger

Opened from:

`Delete`

---

### Content

Title:

`Delete user`

Message:

`Are you sure you want to delete user {firstName} {lastName}?`

Where:

- `{firstName}` = selected user's first name
- `{lastName}` = selected user's last name

---

### Actions

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- CANCEL closes the modal without changes
- CONFIRM deletes the selected user
- Deleted user is removed from the table immediately
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

Displayed while users are being loaded.

Requirements:

- Table remains visible
- Loading indicator is displayed

---

### Empty State

Displayed when no users exist or search returns no results.

Example message:

`No users found`

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

| ID    | Description                                                                                   |
| ----- | --------------------------------------------------------------------------------------------- |
| AC-1  | Users page is accessible for both Admin and Employee roles                                    |
| AC-2  | Employees navigation item is visible for both roles                                           |
| AC-3  | Users table displays Avatar, First Name, Last Name, Email, Department, and Position columns   |
| AC-4  | Search filters users by name and email                                                        |
| AC-5  | Users can be sorted by supported columns                                                      |
| AC-6  | Pagination is available when required                                                         |
| AC-7  | CREATE USER button is visible only for Admin users                                            |
| AC-8  | CREATE USER button opens Create User modal                                                    |
| AC-9  | Administrator can create a new user                                                           |
| AC-10 | User creation requires Email, Password, First Name, Last Name, Department, Position, and Role |
| AC-11 | Password must contain at least 6 characters                                                   |
| AC-12 | Employee users can only open User Details pages                                               |
| AC-13 | Admin action menu contains View, Update, and Delete actions                                   |
| AC-14 | View action opens User Details page                                                           |
| AC-15 | Update action opens Update User modal                                                         |
| AC-16 | Email and Password fields are disabled during user update                                     |
| AC-17 | Administrator can update an existing user                                                     |
| AC-18 | Delete action opens Delete User confirmation modal                                            |
| AC-19 | Confirming deletion removes the selected user                                                 |
| AC-20 | Validation errors are displayed inline                                                        |
| AC-21 | Loading, Empty, and Error states are supported                                                |
| AC-22 | Page supports Light and Dark themes                                                           |
| AC-23 | Page is responsive across supported devices                                                   |
| AC-24 | Keyboard accessibility is fully supported                                                     |

Welcome to Notion!

To Do List
