
# BudgetFlow Expense Tracker - Backend Setup

This document explains how to set up the backend for the BudgetFlow Expense Tracker application.

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Backend Setup Steps

1. Create a new directory for the backend:

```bash
mkdir budget-flow-backend
cd budget-flow-backend
```

2. Initialize a new Node.js project:

```bash
npm init -y
```

3. Install required dependencies:

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
```

4. Create the backend file structure:

```
budget-flow-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── transactionController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Transaction.js
├── routes/
│   ├── auth.js
│   └── transactions.js
├── .env
└── server.js
```

5. Copy the `.env.example` file from the frontend project to your backend directory as `.env` and update the values as needed.

6. Implement the backend code following the MVC pattern:

   - Create database connection in `config/db.js`
   - Set up user and transaction models
   - Implement controllers for authentication and transaction CRUD operations
   - Set up routes for API endpoints
   - Add authentication middleware

7. Start the backend server:

```bash
npm run dev
```

8. Update the frontend to connect to your backend API by setting the `VITE_API_URL` in your frontend `.env` file.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get authenticated user

### Transactions

- `GET /api/transactions` - Get all transactions for authenticated user
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/stats` - Get transaction statistics

## Connecting Frontend to Backend

Once your backend is set up and running, you'll need to modify the frontend code:

1. Replace the local storage data management in the frontend with API calls
2. Update authentication to use JWT tokens
3. Use real API endpoints for CRUD operations
