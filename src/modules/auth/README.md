# Auth Module

## Overview

Handles authentication using JWT, including login, registration, and email verification.

---

## Core Flows

### Register

- Creates a new user
- Ensures email is unique
- Hashes password
- Generates a verification token (valid for 1 day)
- Sends verification email
- Returns access token and user data

---

### Login

- Validates user credentials
- Returns JWT access token
- Returns sanitized user data

---

### Verify Email

- Accepts a JWT token
- Marks user as verified
- Returns success or failure message

---

### Check Authentication

- Requires valid JWT
- Returns authenticated user data

---

## Security

- Passwords are hashed using bcrypt
- JWT is used for authentication
- JWT payload includes:
  - `sub` (user ID)
  - `email`

---

## API Overview

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/verify-email`
- `GET /auth/check`

---

## Error Handling

- `401 Unauthorized` — invalid credentials
- `409 Conflict` — user already exists
- Invalid or expired verification token returns failure message