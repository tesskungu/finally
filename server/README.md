# Fabric App Server

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance) - Already configured with MongoDB Atlas

## Setup

1. Install server dependencies:

```bash
cd server
npm install
```

2. Start the server:

```bash
npm start
```

The server will run on http://localhost:5000 and connect to MongoDB Atlas.

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update user profile (requires token)
- `GET /api/health` - Health check

## Frontend

The frontend connects to the backend at http://localhost:5000. Make sure both server and client are running.
