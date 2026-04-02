# 🩸 BloodLink — Blood Donor System (MERN MVP)

A minimal, production-ready blood donor search system built with the MERN stack.

---

## 📁 Folder Structure

```
blood-donor/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Register & login logic
│   │   └── donorController.js     # Donor search logic
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   └── User.js                # Mongoose user schema
│   ├── routes/
│   │   ├── authRoutes.js          # POST /api/register, /api/login
│   │   └── donorRoutes.js         # GET /api/donors
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance + JWT interceptor
    │   ├── components/
    │   │   ├── AuthContext.js     # Global auth state (React Context)
    │   │   └── Navbar.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── SearchDonors.js
    │   ├── App.js                 # Routes + PrivateRoute guard
    │   └── index.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v16+ 
- **MongoDB** running locally (`mongod`) OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## 🚀 How to Run Locally

### 1. Clone / download the project

```bash
cd blood-donor
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blooddonor
JWT_SECRET=change_this_to_a_long_random_string
```

> For **MongoDB Atlas**, replace MONGO_URI with your connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/blooddonor`

Start the backend:

```bash
# Development (auto-restarts on save)
npm run dev

# OR Production
npm start
```

You should see:
```
MongoDB connected
Server running on port 5000
```

---

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

React will open at **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in `frontend/package.json` routes all `/api` calls to the backend automatically — no CORS issues in dev.

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/register` | `name, email, password, bloodGroup, location, isDonor` | No |
| POST | `/api/login` | `email, password` | No |

### Donors

| Method | Endpoint | Query Params | Auth |
|--------|----------|------|------|
| GET | `/api/donors` | `bloodGroup`, `location` (both optional) | JWT required |

**Example request:**
```
GET /api/donors?bloodGroup=O+&location=mumbai
Authorization: Bearer <token>
```

---

## 🧪 Test with curl

```bash
# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul","email":"rahul@test.com","password":"123456","bloodGroup":"O+","location":"Mumbai","isDonor":true}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@test.com","password":"123456"}'

# Search donors (use token from login response)
curl "http://localhost:5000/api/donors?bloodGroup=O%2B&location=mumbai" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 How Auth Works

1. User registers → password is hashed with **bcrypt** → saved to MongoDB
2. On login → password compared → **JWT token** returned (7-day expiry)
3. Token stored in **localStorage** on the frontend
4. Axios interceptor automatically adds `Authorization: Bearer <token>` to every request
5. Backend `protect` middleware verifies the token on protected routes

---

## 🩸 Blood Groups Supported

`A+` `A-` `B+` `B-` `AB+` `AB-` `O+` `O-`

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

---

## 📌 Key Design Decisions

- **No Redux** — React Context is enough for simple auth state
- **No UI libraries** — plain inline styles keep it dependency-free
- **Proxy in package.json** — avoids CORS config in development
- **MVC structure** — routes → controllers → models (easy to scale)
- **Case-insensitive search** — MongoDB `$regex` with `$options: 'i'`
- **Password never returned** — `.select('-password')` in middleware
