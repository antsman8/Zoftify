# User Management and Logging System API

## Technologies Used

- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger Documentation
- Docker

## Features

- User registration and authentication
- JWT-based authorization with refresh tokens
- Request logging system
- Swagger API documentation
- Docker containerization
- Unit tests

## Installation and Setup

### Step 1: Clone the repository

### Step 2: Environment Setup

Create `.env` file in the root directory:

env

# For local development

POSTGRES_HOST=localhost # Use 'db' for Docker deployment
POSTGRES_PORT=5432
POSTGRES_DATABASE=yourdatabase
POSTGRES_USERNAME=yourusername
POSTGRES_PASSWORD=yourpassword
AUTH_JWT_SECRET=WOnHQTHdJTmHncwuADumW265EPN3Ku9p # random value
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d
BACKEND_HOST=0.0.0.0
BACKEND_PORT=3000

**Important**: Use `POSTGRES_HOST=localhost` for local development and `POSTGRES_HOST=db` for Docker deployment.

### Step 3: Launch Options

#### Option 1: Local Development

# Install dependencies

npm install

# Start the application in development mode

npm run start:dev

## to run locally, you must already have a database created

#### Option 2: Docker Deployment

# Build and start containers

docker-compose up --build

## API Documentation

Swagger documentation is available at:

http://localhost:3000/api/swagger

## Authentication Flow

1. Register a new user:

POST /api/auth/sign-up
{
"name": "John Doe",
"email": "john@example.com",
"password": "password123"
}

2. Login to get tokens:

POST /api/auth/sign-in
{
"email": "john@example.com",
"password": "password123"
}

3. Use the access token in protected routes:

Authorization: Bearer <your_access_token>

4. When access token expires, use refresh token:

POST /api/auth/refresh
{
"refreshToken": "your_refresh_token"
}

## Protected Routes

All routes except authentication endpoints require JWT authentication:

- User management (`/api/users/*`)
  - Create user
  - Get all users
  - Get user by ID
  - Update user
  - Delete user
- Logs management (`/api/logs/*`)
  - Get all logs
  - Get log by ID
  - Get logs by endpoint

## Testing

The project includes unit tests for the authentication service:

# Run tests

npm run test

# Run tests with coverage report

npm run test:cov

## Project Structure

src/
├── auth/ # Authentication module
│ ├── dto/ # Data Transfer Objects
│ ├── guards/ # JWT Guards
│ └── strategies/ # JWT Strategy
├── users/ # User management module
├── log/ # Logging module
└── exceptions/ # Custom exceptions and error handling

```

## Error Handling

The API uses custom exception filters and provides detailed error messages:

json
{
  "statusCode": 400,
  "message": "Validation failed: password must be at least 6 characters",
  "error": "Bad Request",
  "timestamp": "2024-02-20T12:00:00Z",
  "path": "/api/auth/sign-up"
}


## Logging System

All API requests are automatically logged in the database with:

- Request method
- Endpoint
- Execution time
- Status code
- User agent
- IP address



```
