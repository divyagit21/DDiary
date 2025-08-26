# DDiary - Journal & Mood Tracker Website

This is a full-stack journaling and mood tracking app built with Node.js, Express, MongoDB, and React. It features encrypted journals, user authentication, and analysis.

---

## Features

- User signup, login, and authentication with JWT
- Encrypted journal entries using AES-256-CBC
- Journal CRUD operations
- Mood tracking
- Secure cookie-based authentication
- Analysis update on journal entries

---

## Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)
- npm or yarn
- Git (optional)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ddiary.git
cd ddiary
```

---

2. Install dependencies

```bash
npm install
# or
yarn install
```

---

3. Create .env file in the root directory

Create a .env file with the following required environment variables:
- PORT=5000
- CLIENT_ORIGIN=http://localhost:3000 
- MONGO_CONN=your_mongodb_connection_string
- SECRET_KEY=your_jwt_secret_key
- ENCRYPTION_SECRET=your_encryption_secret_key
- ENCRYPTION_SALT=your_encryption_salt

---

4. Run MongoDB

Make sure your MongoDB server is running locally or your cloud instance is accessible.

---

5. Start the backend server

```bash
npm run server
# or
node app.js
```

This should start your backend API at http://localhost:5000 (or the port you set).

---

6. Start the React frontend

In another terminal window, run:
```bash
npm start
# or
yarn start
```
This will start your React development server at http://localhost:3000.

---

Testing the app
- Register a new user via the /signin route.
- Login via the /login route.
- Add, update, delete, and view journals.
- Logout and test the authentication flow.
