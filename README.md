# Loyalty Hub - Backend

Backend for the **Customer Loyalty Offer Management System** mini project.
Built with **Node.js + Express + MySQL**.

## 1. Setup

```bash
cd loyalty-hub-backend
npm install
```

Create a `.env` file (copy from `.env.example`) and fill in your MySQL details:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=loyalty_hub
JWT_SECRET=loyaltyhub_secret_key_change_this
JWT_EXPIRES_IN=1d
```

## 2. Create the database

Open MySQL Workbench / CLI and run the file `database/schema.sql`:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `loyalty_hub` database and all tables: `users`, `offers`,
`discounts`, `reward_transactions`, `feedback`.

## 3. Create an admin account

There's no separate "admin table" — admins are just `users` with `role = 'admin'`.
Easiest way: register normally through `/api/auth/register` (it creates a
`customer`), then run this in MySQL to promote that user to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'youradmin@email.com';
```

## 4. Run the server

```bash
npm start
```

Server runs at `http://localhost:5000`. You should see:
`Loyalty Hub server running on http://localhost:5000`

## 5. API Endpoints

### Auth (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new customer |
| POST | `/login` | Public | Login, returns JWT token |
| GET | `/profile` | Logged-in | Get current user's profile |

### Offers (`/api/offers`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all offers |
| GET | `/:id` | Public | Get one offer |
| POST | `/` | Admin | Create offer |
| PUT | `/:id` | Admin | Update offer |
| DELETE | `/:id` | Admin | Delete offer |

### Discounts (`/api/discounts`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all discount offers |
| POST | `/` | Admin | Create discount |
| PUT | `/:id` | Admin | Update discount |
| DELETE | `/:id` | Admin | Delete discount |

### Reward Points (`/api/rewards`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/my-points` | Logged-in | View my points + history |
| POST | `/redeem` | Logged-in | Redeem points for an offer (`{ offer_id }`) |
| POST | `/add` | Admin | Add points to a user (`{ user_id, points, reason }`) |

### Feedback & Reviews (`/api/feedback`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | View all feedback/reviews |
| POST | `/` | Logged-in | Submit feedback (`{ rating, message }`) |
| DELETE | `/:id` | Admin | Delete a feedback entry |

### Admin Dashboard (`/api/admin`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Admin | Summary stats (users, offers, ratings, etc.) |
| GET | `/users` | Admin | List all customers |

For protected routes, send the JWT token from login in the header:
```
Authorization: Bearer <token>
```

## 6. Connecting your frontend (pm1.html)

In your login form's JS, call the login API like this:

```js
async function handleLogin(email, password) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.user.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'home.html';
    }
  } else {
    alert(data.message);
  }
}
```

For any protected page (Offers, Reward Points, Admin Dashboard), send the
token with every request:

```js
const token = localStorage.getItem('token');
const res = await fetch('http://localhost:5000/api/rewards/my-points', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Folder Structure

```
loyalty-hub-backend/
├── server.js
├── package.json
├── .env.example
├── config/db.js
├── middleware/auth.js
├── database/schema.sql
├── controllers/
│   ├── authController.js
│   ├── offerController.js
│   ├── discountController.js
│   ├── rewardController.js
│   ├── feedbackController.js
│   └── adminController.js
└── routes/
    ├── authRoutes.js
    ├── offerRoutes.js
    ├── discountRoutes.js
    ├── rewardRoutes.js
    ├── feedbackRoutes.js
    └── adminRoutes.js
```
