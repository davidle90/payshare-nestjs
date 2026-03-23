# PayShare App

PayShare is a NestJS backend application for managing shared expenses between groups. It allows users to track group expenses, calculate balances, and simplify transactions. The backend is designed to work seamlessly with the frontend project.

## Features

- **User Management:** Create and manage user accounts.  
- **Groups:** Create or join groups, invite users, and manage group members.  
- **Expenses:** Add, update, and track expenses within groups.  
- **Simplified Balances:** Automatically calculates balances and minimizes the number of transactions between group members.  
- **Database:** Uses PostgreSQL for secure and efficient data storage.  
- **Authentication & Security:** JWT-based authentication and role management.  
- **Frontend Integration:** Works seamlessly with the linked frontend application.  

## Tech Stack

- **Backend:** NestJS, TypeScript  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **Frontend:** VueJS

## Frontend

The frontend application is available here: [Frontend Project Repository](https://github.com/davidle90/payshare-client)

## Installation

```bash
# Clone the repository
git clone https://github.com/davidle90/payshare-nestjs.git

# Navigate into the project
cd payshare-nestjs

# Install dependencies
npm install
```

## Configuration

Copy `.env.example` to `.env` and update the variables with your configuration.

```bash
# Migrate
npm run migration:run

# Seed data (admin user and roles)
npm run db:seed
```

## Running the app

```bash
npm run start
```

## Test

```bash
# Unit test
npm run test

# e2e test
npm run test:e2e
```
