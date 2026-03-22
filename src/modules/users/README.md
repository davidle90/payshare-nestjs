# Users Module

Handles user management, including creation, updates, deletion, and email verification.

---

## Overview

This module provides functionality for:

- Creating users (admin only)
- Retrieving users
- Updating user data
- Deleting users
- Email verification

---

## Core Behavior

- Passwords are hashed using bcrypt before storage
- Username and email must be unique
- Updating a password will re-hash it
- Deleting a user returns a boolean result
- Email verification sets `isVerified = true`

---

## API Overview

### Public / Authenticated

- `GET /users` — Get all users
- `GET /users/:id` — Get user by ID
- `GET /users/by-username/:username` — Get user by username
- `PATCH /users/me` — Update current user
- `DELETE /users/me` — Delete current user

---

### Admin Only

- `POST /users` — Create user
- `PATCH /users/:id` — Update user by ID
- `PATCH /users/by-username/:username` — Update user by username
- `DELETE /users/:id` — Delete user by ID
- `DELETE /users/by-username/:username` — Delete user by username

---

## Error Handling

- Returns `404 Not Found` if user does not exist
- Returns `409 Conflict` if username or email already exists