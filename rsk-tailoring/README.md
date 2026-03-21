# RSK Fashion Tailoring - Full Stack Web Application

A complete tailoring management system with customer-facing design gallery & ordering, and a full admin dashboard.

## Tech Stack
- **Frontend**: React.js + React Router DOM
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Styling**: Custom CSS (Playfair Display + Lato fonts)
- **Auth**: JWT (JSON Web Tokens)
- **File Upload**: Multer

---

## 🚀 Quick Setup Guide

### Prerequisites
- Node.js (v16+)
- MySQL Server (v8+)
- npm

---

### Step 1: Database Setup

1. Open MySQL Workbench or MySQL CLI
2. Run the SQL setup file:
```sql
source /path/to/rsk-tailoring/backend/database.sql
```
Or copy-paste the contents of `backend/database.sql` into your MySQL client.

This will create:
- `rsk_tailoring` database
- `designs`, `orders`, and `admins` tables
- Sample designs
- Default admin user (username: `admin`, password: `admin123`)

---

### Step 2: Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rsk_tailoring
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Install dependencies and start:
```bash
npm install
npm start
```

Backend runs at: **http://localhost:5000**

---

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 📁 Project Structure

```
rsk-tailoring/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── designController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── designs.js
│   │   └── orders.js
│   ├── uploads/           (auto-created for image uploads)
│   ├── database.sql
│   ├── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── admin/
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminDesigns.js
    │   │   ├── AdminLayout.js
    │   │   ├── AdminLogin.js
    │   │   └── AdminOrders.js
    │   ├── components/
    │   │   ├── Footer.js
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Designs.js
    │   │   ├── Home.js
    │   │   └── Order.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🔗 Application URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Design Gallery | http://localhost:3000/designs |
| Place Order | http://localhost:3000/order |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin/dashboard |
| Admin Orders | http://localhost:3000/admin/orders |
| Admin Designs | http://localhost:3000/admin/designs |

---

## 🔑 Admin Credentials

| Username | Password |
|----------|----------|
| `admin`  | `admin123` |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Admin login |
| GET | /api/designs | No | Get all designs |
| POST | /api/designs | Yes | Add new design |
| PUT | /api/designs/:id | Yes | Update design |
| DELETE | /api/designs/:id | Yes | Delete design |
| POST | /api/orders | No | Place new order |
| GET | /api/orders | Yes | Get all orders (with search/filter) |
| GET | /api/orders/dashboard | Yes | Dashboard stats |
| PUT | /api/orders/:id | Yes | Update order status |
| DELETE | /api/orders/:id | Yes | Delete order |

---

## ✨ Features

### Customer Side
- 🏠 Beautiful home page with hero section & featured designs
- 👗 Design gallery with real-time data from database
- 📋 Order form with measurement input & design selection
- 📱 Fully responsive mobile design

### Admin Panel
- 🔐 Secure JWT-based login
- 📊 Dashboard with statistics (total orders, pending, revenue)
- 📋 Order management with search by phone & filter by status
- 👗 Design management with image upload support
- ✏️ Edit & delete orders and designs
