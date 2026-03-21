# AuthModule

## Overview
Handles authentication logic, including:
- validateUser
- login
- register
- JWT token generation

## validateUser
Validates a user’s credentials.

**Inputs:**
- email: string
- password: string

**Outputs:**
- user object if credentials are valid

**Throws:**
- UnauthorizedException if credentials are invalid

**Tests:**
- Happy path: valid credentials
- Failures: wrong password or non-existent user

## login

Authenticates a user and returns a JWT access token.

**Input:**
- user (validated user object)

**Output:**
- access_token: JWT token
- user: mapped user response

**Behavior:**
- Generates a JWT with user id (`sub`) and email
- Returns a sanitized user object via UserMapper

**Used in:**
- POST /auth/login

## register

Registers a new user and initiates email verification.

### Input
- username: string  
- email: string  
- password: string  

### Output
- user: mapped user object  
- verification_url: link sent via email for account verification  
- access_token: JWT token for authentication  

### Behavior
- Checks if a user with the given email already exists  
- Creates a new user if email is not in use  
- Generates a verification token (valid for 1 day)  
- Sends a verification email containing the token  
- Returns user data along with verification URL and access token  

### Errors
- Throws `ConflictException` if a user with the email already exists  

### Notes
- The JWT payload includes:
  - `sub`: user ID  
  - `email`: user email  
- User data is returned using `UserMapper.toResponse` to avoid exposing sensitive fields  

## verify-email

Verifies a user's email using a JWT token.

**Endpoint:**
GET /auth/verify-email?token=...

**Behavior:**
- Decodes JWT token
- Marks user as verified
- Returns success or failure message

---

## login (endpoint)

Authenticates a user.

**Endpoint:**
POST /auth/login

**Input:**
- email
- password

**Behavior:**
- Validates credentials
- Returns JWT token and user data

---

## checkAuth

Checks if a request is authenticated.

**Endpoint:**
GET /auth/check

**Behavior:**
- Retrieves user from request
- Returns authentication status and user data