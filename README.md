# Car Rental MERN

A full-stack car rental application built with React, Node.js, Express and MongoDB.

## Features
- User registration and login with JWT
- Browse available cars
- Search cars
- Book a car
- View and cancel your bookings
- Admin can add and delete cars
- REST API
- Responsive React UI

## Setup

### Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/car_rental
JWT_SECRET=change_this_secret
```

Run:
```bash
npm run dev
```

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally http://localhost:5173.

## Demo admin
Register a normal account first. To make it admin, change `isAdmin` to true in MongoDB for that user.
