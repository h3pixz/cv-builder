!USERS SKILLS.jpg

## Purpose

Allows viewing and managing user skills.

The available functionality depends on:

- current user's role
- whose profile is being viewed

### Employee

### Viewing Own Profile

Can:

- View skills
- Add skills
- Update skill mastery
- Remove skills

### Viewing Another User Profile

Can:

- View skills only

Cannot:

- Add skills
- Update skills
- Remove skills

### Admin

Can:

- View skills
- Add skills
- Update skills
- Remove skills

for any user profile.

---

## Scope

The Skills tab is available on the User Details page.

The tab is available for:

- Admin
- Employee

Role-based permissions apply.

---

## Behavior

The page allows users to:

- View assigned skills
- View skills grouped by category
- View skill mastery levels

Depending on permissions, users may also:

- Add skills
- Update skill mastery
- Remove skills

---

## Design Reference

Figma: CV Builder – User Details – Skills

---

## Layout

Page must follow the User Details layout structure.

The Skills tab is displayed inside the User Details page.

Requirements:

- Skills are grouped by category
- Categories are displayed as separate sections
- Skills are displayed within their category group
- Layout must be responsive across desktop and tablet devices
- Supports Light and Dark themes

---

## Navigation

The Skills tab is available from:

`Skills`

Requirements:

- Active tab must be visually highlighted
- Tab state must persist after page refresh when possible

---

## Content

### Skill Groups

Skills are grouped by category.

Examples:

- Programming Languages
- Frontend
- Backend
- Databases
- DevOps
- Source Control Systems

Requirements:

- Each category displays its name
- Skills belonging to the category are displayed below it
- Categories are displayed only when they contain skills

---

### Skill Item

Each skill displays:

- Skill Name
- Skill Mastery Level

Requirements:

- Visual representation follows design specifications
- Mastery level is clearly visible

---

## Permissions

### Employee Viewing Own Profile

Available actions:

- Add Skill
- Update Skill
- Remove Skills

---

### Employee Viewing Another User Profile

Available actions:

- View skills

Restricted actions:

- Add Skill
- Update Skill
- Remove Skills

Requirements:

- Management buttons must not be displayed
- Skill items must not be editable
- Clicking a skill does not open Update Skill modal

---

### Admin Viewing Any Profile

Available actions:

- Add Skill
- Update Skill
- Remove Skills

Requirements:

- Functionality is identical regardless of whose profile is being viewed

---

## Add Skill

### Trigger

Opened from:

`ADD SKILL`

Requirements:

- Available for profile owner
- Available for Admin
- Hidden for Employees viewing another user's profile

---

### Add Skill Modal

### Content

Title:

`Add skill`

Fields:

### Skill

Select field

Requirements:

- Required
- Displays available skills
- Already assigned skills must not be available for selection

---

### Skill Mastery

Select field

Available values:

- Beginner
- Elementary
- Intermediate
- Advanced
- Expert

Requirements:

- Required

---

### Validation

Validation messages must be displayed inline.

Rules:

- Skill is required
- Skill Mastery is required

Example messages:

- `Skill is required`
- `Skill mastery is required`

---

### Actions

Buttons:

- `CANCEL`
- `ADD`

Requirements:

- ADD remains disabled until all required fields are valid
- Successful creation adds the skill to the appropriate category
- Modal closes after successful creation

---

## Update Skill

### Trigger

Opened by clicking a skill item.

Requirements:

Available for:

- Profile owner
- Admin

Not available for:

- Employees viewing another user's profile

---

### Update Skill Modal

### Content

Title:

`Update skill`

Fields:

### Skill

Select field

Requirements:

- Disabled
- Displays currently selected skill

---

### Skill Mastery

Select field

Available values:

- Beginner
- Elementary
- Intermediate
- Advanced
- Expert

Requirements:

- Required

---

### Validation

Validation messages must be displayed inline.

Rules:

- Skill Mastery is required

Example message:

- `Skill mastery is required`

---

### Actions

Buttons:

- `CANCEL`
- `SAVE`

Requirements:

- SAVE updates selected skill
- Modal closes after successful update
- Updated value appears immediately

---

## Remove Skills

### Trigger

Opened from:

`REMOVE SKILLS`

Requirements:

- Available for profile owner
- Available for Admin
- Hidden for Employees viewing another user's profile

---

### Selection Mode

Clicking REMOVE SKILLS enables selection mode.

Requirements:

- Multiple skills can be selected
- Selected skills are visually highlighted
- Selected count is displayed on the Remove button

Example:

`REMOVE (3)`

---

### Actions

Buttons:

- `CANCEL`
- `REMOVE`

Requirements:

- REMOVE is disabled when no skills are selected
- REMOVE opens Remove Skills confirmation modal

---

## Remove Skills Modal

### Content

Title:

`Remove skills`

Message:

`Are you sure you want to remove {count} skills?`

Where:

- `{count}` = number of selected skills

---

### Actions

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- CANCEL closes the modal without changes
- CONFIRM removes selected skills
- Skills are removed immediately after successful operation
- Modal closes after successful removal
- Selection mode exits automatically

---

## States

### Loading State

Displayed while skills are being loaded.

Requirements:

- Skill groups remain visible when possible
- Loading indicators or skeletons are displayed

---

### Empty State

Displayed when the user has no assigned skills.

Example message:

`No skills added yet`

Requirements:

- Empty state is displayed instead of skill groups

---

### Error State

Displayed when skills cannot be loaded.

Requirements:

- Error message is shown
- Retry action is available

Example:

`Failed to load skills`

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
| AC-1  | Skills tab is available on the User Details page               |
| AC-2  | Skills are grouped by category                                 |
| AC-3  | Users can view assigned skills and mastery levels              |
| AC-4  | Employees can manage skills only on their own profile          |
| AC-5  | Employees viewing another user's profile have read-only access |
| AC-6  | Admins can manage skills on any user profile                   |
| AC-7  | ADD SKILL action opens Add Skill modal                         |
| AC-8  | Skill and Skill Mastery fields are required                    |
| AC-9  | Successfully adding a skill updates the page immediately       |
| AC-10 | Clicking a skill opens Update Skill modal when permitted       |
| AC-11 | Skill field is disabled during update                          |
| AC-12 | Successfully updating a skill refreshes displayed data         |
| AC-13 | REMOVE SKILLS action enables selection mode                    |
| AC-14 | Multiple skills can be selected for removal                    |
| AC-15 | Remove action opens confirmation modal                         |
| AC-16 | Confirming removal deletes selected skills                     |
| AC-17 | Loading, Empty, and Error states are supported                 |
| AC-18 | Validation errors are displayed inline                         |
| AC-19 | Page supports Light and Dark themes                            |
| AC-20 | Page is responsive across supported devices                    |
| AC-21 | Keyboard accessibility is fully supported                      |
