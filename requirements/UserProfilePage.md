!1440w light.jpg

## Purpose

Allows viewing and managing user profile information.

The available functionality depends on:

- current user's role
- whose profile is being viewed

### Employee

### Viewing Own Profile

Can:

- View profile information
- Update profile information
- Upload or change avatar
- Verify email address

### Viewing Another User Profile

Can:

- View profile information only

Cannot:

- Update profile information
- Upload avatar
- Verify email address

### Admin

Can:

- View profile information
- Update profile information
- Upload or change avatar

for any user profile.

---

## Scope

The Profile tab is available on the User Details page.

The tab is available for:

- Admin
- Employee

Role-based permissions apply.

---

## Behavior

The page allows users to:

- View user avatar
- View first name
- View last name
- View email address
- View member since date
- View department
- View position

Depending on permissions, users may also:

- Update profile information
- Upload avatar image
- Verify email address

---

## Design Reference

Figma: CV Builder – User Details – Profile (Admin) and User Details – Profile (User)

---

## Layout

Page must follow the User Details layout structure.

The Profile tab is displayed inside the User Details page.

Requirements:

- User avatar is displayed at the top of the page
- User full name is displayed below the avatar
- Email address is displayed below the full name
- Membership date is displayed below the email
- Profile fields are displayed in a two-column layout
- Layout must be responsive across desktop and tablet devices
- Supports Light and Dark themes

---

## Navigation

The Profile tab is available from:

`Profile`

Requirements:

- Active tab must be visually highlighted
- Tab state must persist after page refresh when possible

---

## Content

### Profile Information

The page displays:

- Avatar
- First Name
- Last Name
- Email
- Member Since
- Department
- Position

Requirements:

- All displayed values must reflect current user data
- Email address is displayed as read-only
- Member Since date is displayed as read-only

---

### Avatar

Displays the user's profile image.

Requirements:

- If no avatar exists, display user initials placeholder
- Avatar is displayed using a circular format
- Avatar updates immediately after successful upload

---

### Department

Displays the department assigned to the user.

Requirements:

- Department name is displayed
- Department selection is available only when editing is permitted

---

### Position

Displays the position assigned to the user.

Requirements:

- Position name is displayed
- Position selection is available only when editing is permitted

---

## Permissions

### Employee Viewing Own Profile

Available actions:

- Update profile
- Upload avatar
- Verify email

---

### Employee Viewing Another User Profile

Available actions:

- View profile information

Restricted actions:

- Update profile
- Upload avatar
- Verify email

Requirements:

- Profile fields must be read-only
- Upload avatar control must not be displayed
- UPDATE button must not be displayed
- VERIFY EMAIL button must not be displayed

---

### Admin Viewing Any Profile

Available actions:

- Update profile
- Upload avatar

Requirements:

- Functionality is identical regardless of whose profile is being viewed
- Email verification action is available only for the profile owner

---

## Update Profile

### Editable Fields

### First Name

Text field

Requirements:

- Required
- Maximum length: 100 characters

---

### Last Name

Text field

Requirements:

- Required
- Maximum length: 100 characters

---

### Department

Select field

Requirements:

- Required
- Displays available departments

---

### Position

Select field

Requirements:

- Required
- Displays available positions

---

### Read-Only Fields

Fields:

- Email
- Member Since

Requirements:

- Values cannot be edited
- Read-only styling follows design specifications

---

### Validation

Validation messages must be displayed inline.

Rules:

- First Name is required
- Last Name is required
- Department is required
- Position is required

Example messages:

- `First name is required`
- `Last name is required`
- `Department is required`
- `Position is required`

---

### Actions

Buttons:

- `UPDATE`

Requirements:

- Available only when editing is permitted
- Disabled until at least one value is changed
- Disabled when validation errors exist
- Successful update refreshes displayed data immediately

---

## Upload Avatar

### Trigger

Opened from:

`Upload avatar image`

Requirements:

- Available for profile owner
- Available for Admin
- Hidden for Employees viewing another user's profile

---

### Supported Formats

Allowed file types:

- PNG
- JPG
- JPEG
- GIF

Requirements:

- Unsupported file types must be rejected

---

### File Size Validation

Maximum file size: `5MB`

Requirements:

- Files exceeding the limit must be rejected
- Validation message must be displayed

Example:

`File size must not exceed 5MB`

---

### Upload Behavior

Requirements:

- Upload begins after file selection
- Upload progress may be displayed
- Successfully uploaded image replaces existing avatar
- Avatar preview updates immediately
- Failed uploads display an error message

---

## Verify Email

### Trigger

Opened from:

`VERIFY EMAIL`

Requirements:

- Available only for profile owner
- Hidden for Admin when viewing another user's profile
- Hidden for Employees viewing another user's profile

---

### Behavior

Requirements:

- Clicking VERIFY EMAIL initiates the email verification process
- Verification email is sent to the user's registered email address
- User is redirected to the Email Verification page
- Success notification is displayed on the Email Verification page

Example:

`Verification email has been sent`

---

### Error Handling

Requirements:

- Failed requests display an error message
- User remains on the current page

Example:

`Failed to send verification email`

---

## States

### Loading State

Displayed while profile information is being loaded.

Requirements:

- Skeleton loaders or loading indicators are displayed
- Layout structure remains visible when possible

---

### Empty State

Displayed when optional profile information is missing.

Examples:

- No avatar uploaded
- Department not assigned
- Position not assigned

Requirements:

- Placeholder values follow design specifications

---

### Error State

Displayed when profile information cannot be loaded.

Requirements:

- Error message is shown
- Retry action is available

Example:

`Failed to load profile information`

---

## Validation & Error Handling

Requirements:

- Failed update requests must display a system error
- Failed avatar upload requests must display a system error
- Failed email verification requests must display a system error
- Validation errors must be displayed inline
- Failed requests must not clear entered values

---

## Accessibility & Responsiveness

Requirements:

- Full keyboard navigation support
- Visible focus states
- Accessible labels for form controls
- File upload control is keyboard accessible
- Content remains readable in Light and Dark themes
- Layout scales correctly across supported screen sizes

---

## Acceptance Criteria

| ID    | Description                                                          |
| ----- | -------------------------------------------------------------------- |
| AC-1  | Profile tab is available on the User Details page                    |
| AC-2  | Users can view avatar, personal information, department and position |
| AC-3  | Employees can edit only their own profile                            |
| AC-4  | Employees viewing another user's profile have read-only access       |
| AC-5  | Admins can edit any user profile                                     |
| AC-6  | First Name is a required field                                       |
| AC-7  | Last Name is a required field                                        |
| AC-8  | Department is a required field                                       |
| AC-9  | Position is a required field                                         |
| AC-10 | UPDATE button is displayed only when editing is permitted            |
| AC-11 | Successful update refreshes displayed profile information            |
| AC-12 | Avatar upload is available only when permitted                       |
| AC-13 | Supported avatar formats are PNG, JPG, JPEG and GIF                  |
| AC-14 | Avatar upload rejects files larger than 5MB                          |
| AC-15 | Successful avatar upload updates the displayed avatar immediately    |
| AC-16 | VERIFY EMAIL action is available only for the profile owner          |
| AC-17 | Verification email can be sent successfully                          |
| AC-18 | Loading, Empty, and Error states are supported                       |
| AC-19 | Validation errors are displayed inline                               |
| AC-20 | Page supports Light and Dark themes                                  |
| AC-21 | Page is responsive across supported devices                          |
| AC-22 | Keyboard accessibility is fully supported                            |
