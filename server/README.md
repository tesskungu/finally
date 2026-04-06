# Fabric App Server

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Neon Postgres is supported out of the box through `DATABASE_URL`

## Setup

1. Install server dependencies:

```bash
cd server
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your Neon connection string.

3. Start the server:

```bash
npm start
```

The server will run on http://localhost:5000 and connect to PostgreSQL.

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update user profile (requires token)
- `GET /api/health` - Health check

## Frontend

The frontend connects to the backend at http://localhost:5000. Make sure both server and client are running.
