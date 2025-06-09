# Distribution Management System

A comprehensive software solution for managing distribution operations, inventory, sales, and financial tracking.

## Features

- **Inventory Management**: Track stock levels, manage receipts, and monitor daily sales
- **Sales Management**: Record sales by salesman, track targets and achievements
- **Financial Management**: Calculate profits, manage credits and recoveries
- **User Management**: Role-based access control (Owner, Admin, Salesmen)
- **Reporting**: Generate detailed reports on sales, inventory, and finances

## Project Structure

- `/backend`: Server-side code and API endpoints
- `/frontend`: User interface components and pages
- `/database`: Database schema and migration scripts
- `/config`: Configuration files
- `/utils`: Utility functions and helper modules
- `/docs`: Documentation files

## Technologies Used

- **Backend**: Node.js with Express
- **Frontend**: React.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14.0.0 or later)
- MongoDB (v4.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd distribution-software
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory:
   ```
   cp .env.example .env
   ```

5. Update the `.env` file with your MongoDB URI and JWT secret:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/distribution_system
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

## Running the Application

1. Run the backend and frontend concurrently:
   ```
   npm run dev
   ```

2. For backend only:
   ```
   npm run server
   ```

3. For frontend only:
   ```
   npm run client
   ```

## Initial Setup

1. Create an owner account:
   ```
   POST /api/users/register
   {
     "name": "Owner Name",
     "email": "owner@example.com",
     "password": "password123",
     "role": "owner"
   }
   ```

2. Login with the owner account:
   ```
   POST /api/users/login
   {
     "email": "owner@example.com",
     "password": "password123"
   }
   ```

3. Add products, create users, and start managing your distribution business!

## User Roles

- **Owner**: Has full access to all features and can manage users
- **Admin**: Can manage products, inventory, sales, and finances
- **Salesman**: Can create sales and view their own sales data

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user (admin/owner only)
- `POST /api/users/login` - Authenticate user and get token
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/:id` - Update user (admin/owner only)
- `DELETE /api/users/:id` - Delete user (owner only)
- `GET /api/users` - Get all users (admin/owner only)

### Products
- `POST /api/products` - Create a new product (admin/owner only)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (admin/owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Inventory
- `POST /api/inventory` - Create inventory transaction (admin/owner only)
- `GET /api/inventory` - Get all inventory transactions
- `GET /api/inventory/stock` - Get current stock levels
- `GET /api/inventory/report/daily` - Get daily inventory report
- `GET /api/inventory/:id` - Get inventory transaction by ID
- `PUT /api/inventory/:id` - Update inventory transaction (admin/owner only)
- `DELETE /api/inventory/:id` - Delete inventory transaction (owner only)

### Sales
- `POST /api/sales` - Create a new sale
- `GET /api/sales` - Get all sales
- `GET /api/sales/report/daily` - Get daily sales report
- `GET /api/sales/report/monthly` - Get monthly sales report
- `GET /api/sales/report/salesman` - Get salesman sales report
- `GET /api/sales/:id` - Get sale by ID
- `PUT /api/sales/:id` - Update sale (admin/owner only)
- `DELETE /api/sales/:id` - Delete sale (owner only)

### Finance
- `POST /api/finance` - Create finance transaction (admin/owner only)
- `GET /api/finance` - Get all finance transactions
- `GET /api/finance/report/daily` - Get daily finance report
- `GET /api/finance/report/monthly` - Get monthly finance report
- `GET /api/finance/report/cashflow` - Get cash flow report (admin/owner only)
- `GET /api/finance/report/profit` - Get profit report (admin/owner only)
- `GET /api/finance/:id` - Get finance transaction by ID
- `PUT /api/finance/:id` - Update finance transaction (admin/owner only)
- `DELETE /api/finance/:id` - Delete finance transaction (owner only) 