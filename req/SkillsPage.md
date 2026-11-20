!SKILLS.jpg

## Purpose

Allows users to manage their personal skill set by adding, editing, and removing skills with proficiency levels.

---

## Scope

This page is available for both **User** and **Admin** roles when managing their own profile skills.

This specification describes the **User Skills page** only.

Administrative skill management is covered by a separate page.

---

## Behavior

The page allows users to:

- View assigned skills grouped by category
- View skill proficiency levels
- Add new skills
- Edit existing skills
- Select multiple skills for removal
- Remove selected skills after confirmation

---

## Design Reference

Figma: CV Builder – Skills (User)

---

## Layout

- Page must follow the standard application layout
- Sidebar navigation remains visible and accessible
- Skills are grouped by category
- Categories are displayed vertically
- Skills are displayed within their corresponding category
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

### Skill Categories

Skills must be displayed grouped by categories.

Examples:

- Programming Languages
- Frontend
- Backend
- Source Control Systems

Requirements:

- Categories are displayed as section headers
- Skills are displayed under the corresponding category
- Empty categories must not be displayed

---

### Skill Item

Each skill displays:

- Skill name
- Skill proficiency indicator

Requirements:

- Proficiency level must be visually represented
- Skill item must support selection mode
- Skill item must support editing

---

### Add Skill Action

Button: `ADD SKILL`

Requirements:

- Opens Add Skill modal
- Available when not in removal mode
- Supports:
  - default
  - hover
  - pressed
  - disabled states

---

### Remove Skills Action

Button: `REMOVE SKILLS`

Requirements:

- Activates skill selection mode
- Allows selecting multiple skills
- Selected skills must be visually highlighted
- Button changes to deletion action when at least one skill is selected

Examples:

- `DELETE (1)`
- `DELETE (3)`
- `DELETE (5)`

Requirements:

- Count reflects the number of selected skills
- Cancel action exits selection mode and clears selected items

---

## Add Skill Modal

Title:

`Add skill`

Fields:

### Skill

Select field containing available skills.

Requirements:

- Required field
- Displays available skills
- Supports dropdown selection

### Skill Mastery

Select field containing proficiency levels.

Requirements:

- Required field
- Displays available mastery levels

Available values:

- Novice (gray)
- Advanced (blue)
- Competent (green)
- Proficient (yellow)
- Expert (red)

### Actions

Buttons:

- `CANCEL`
- `ADD`

Requirements:

- Add button remains disabled until all required fields are completed
- Cancel closes modal without saving changes
- Add creates a new skill and updates the list

---

## Edit Skill Modal

Title:

`Update skill`

Fields:

### Skill

Requirements:

- Displays selected skill
- Read-only (disabled)
- Cannot be changed

### Skill Mastery

Requirements:

- Editable
- Allows updating proficiency level

### Actions

Buttons:

- `CANCEL`
- `UPDATE`

Requirements:

- Save updates skill proficiency
- Cancel closes modal without changes

---

## Remove Skills Confirmation Modal

Title:

`Remove skill`

Message:

`Are you sure you want to remove {count} skills?`

Examples:

- Are you sure you want to remove 1 skill?
- Are you sure you want to remove 3 skills?

Buttons:

- `CANCEL`
- `CONFIRM`

Requirements:

- Cancel closes modal without removing skills
- Confirm removes all selected skills
- Removed skills disappear from the list immediately after successful operation

---

## Validation & Error Handling

### Add/Edit Skill Validation

- Skill is required
- Skill mastery is required
- Duplicate skills must not be allowed

Example messages:

- `Skill is required`
- `Skill mastery is required`
- `Skill already exists`

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
| AC-1  | User can view skills grouped by category            |
| AC-2  | Skill proficiency is visually displayed             |
| AC-3  | User can open Add Skill modal                       |
| AC-4  | User can create a new skill                         |
| AC-5  | User can open Edit Skill modal                      |
| AC-6  | Skill field is disabled in Edit mode                |
| AC-7  | User can update skill mastery                       |
| AC-8  | User can enter skill removal mode                   |
| AC-9  | Multiple skills can be selected for deletion        |
| AC-10 | Selected skills are visually highlighted            |
| AC-11 | Delete action displays selected skill count         |
| AC-12 | Confirmation modal is displayed before deletion     |
| AC-13 | Confirm removes selected skills                     |
| AC-14 | Validation messages are displayed for invalid input |
| AC-15 | Duplicate skills cannot be added                    |
| AC-16 | Page supports Light and Dark themes                 |
| AC-17 | Page is responsive across supported devices         |
