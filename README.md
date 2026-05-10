# ☀️ Solar Marketplace Backend API

A scalable backend API for a Solar Marketplace platform where customers can browse solar products, request installation quotes, review companies, and manage installations.

Built with:

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication

---

# 🚀 Features

## 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-based Access (Customer / Company)

## 🏢 Companies
- Create company profile
- View company details
- Update company information

## 📦 Products
- Add solar products
- View all products
- Update product details
- Delete products

## 📝 Quotes
- Customers can request quotes
- Companies can approve/reject quotes
- Quote tracking system

## ⭐ Reviews
- Customers can leave reviews
- Ratings system
- Company review aggregation

## 🔧 Installations
- Manage installation requests
- Track installation status
- Customer-company relationship handling

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend Runtime |
| Express.js | API Framework |
| TypeScript | Static Typing |
| PostgreSQL | Database |
| Prisma ORM | Database ORM |
| JWT | Authentication |
| Zod | Validation |
| bcryptjs | Password Hashing |

---

# 📁 Project Structure

```bash
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── companyController.ts
│   │   ├── productController.ts
│   │   ├── quoteController.ts
│   │   ├── installationController.ts
│   │   └── reviewController.ts
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── companyRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── quoteRoutes.ts
│   │   ├── installationRoutes.ts
│   │   └── reviewRoutes.ts
│   │
│   ├── validations/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   └── server.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/solar-marketplace-backend.git
```

---

## 2️⃣ Navigate Into Project

```bash
cd solar-marketplace-backend
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory.

## `.env`

```env
DATABASE_URL="postgresql://username:password@localhost:5432/solar_marketplace"

JWT_SECRET="your_secret_key"

JWT_EXPIRE="7d"

PORT=5001

NODE_ENV="development"
```

---

# 📄 `.env.example`

```env
DATABASE_URL=

JWT_SECRET=

JWT_EXPIRE=

PORT=

NODE_ENV=
```

---

# 🗄️ Database Setup

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migration

```bash
npx prisma migrate dev --name init
```

---

## Seed Database

```bash
npx prisma db seed
```

---

# ▶️ Running the Server

## Development Mode

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
```

---

## Start Production Server

```bash
npm start
```

---

# 📦 Dependencies

## Main Dependencies

```bash
npm install express cors dotenv bcryptjs jsonwebtoken cookie-parser zod
```

---

## Database Dependencies

```bash
npm install prisma @prisma/client pg
```

---

## Development Dependencies

```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/bcryptjs
```

---

# 📜 NPM Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "seed": "ts-node prisma/seed.ts"
}
```

---

# 🔌 API Endpoints

# 🔐 Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| POST | /api/auth/logout | Logout user | Private |

---

# 🏢 Companies

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/companies | Get all companies | Public |
| GET | /api/companies/:id | Get single company | Public |
| POST | /api/companies | Create company | Private |
| PUT | /api/companies/:id | Update company | Private |
| DELETE | /api/companies/:id | Delete company | Private |

---

# 📦 Products

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/products | Get all products | Public |
| GET | /api/products/:id | Get single product | Public |
| POST | /api/products | Create product | Private |
| PUT | /api/products/:id | Update product | Private |
| DELETE | /api/products/:id | Delete product | Private |

---

# 📝 Quotes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/quotes | Request quote | Private |
| GET | /api/quotes | Get all quotes | Private |
| PUT | /api/quotes/:id | Update quote status | Private |

---

# ⭐ Reviews

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/reviews | Add review | Private |
| GET | /api/reviews | Get reviews | Public |
| DELETE | /api/reviews/:id | Delete review | Private |

---

# 🔧 Installations

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/installations | Create installation | Private |
| GET | /api/installations | Get installations | Private |
| PUT | /api/installations/:id | Update installation | Private |

---

# 🔐 Authentication Flow

1. User registers
2. Password is hashed using bcryptjs
3. JWT token is generated upon login
4. Token is stored in cookies or Authorization header
5. Protected routes verify token validity

---

# 🧩 Database Relationships

## User
- Can request multiple quotes
- Can leave multiple reviews
- Can have multiple installations

## Company
- Can own multiple products
- Can receive multiple reviews
- Can receive multiple quotes

## Product
- Belongs to one company

## Review
- Belongs to one user
- Belongs to one company

## Quote
- Belongs to one user
- Belongs to one company

---

# 🌱 Seed Data

The project includes database seed scripts that generate:

- 10 Users
- 10 Companies
- 10 Products
- 10 Reviews
- 10 Quotes
- 10 Installations

---

# 🧪 Testing

Testing can be implemented using:

- Jest
- Supertest

Example:

```bash
npm install -D jest supertest
```

---

# 🚨 Error Handling

Global error handling includes:

- Validation errors
- Authentication errors
- Database errors
- Unhandled promise rejections
- Uncaught exceptions

---

# 🔒 Security Features

- Password Hashing
- JWT Authentication
- Protected Routes
- Environment Variables
- Input Validation using Zod
- Secure HTTP-only Cookies

---

# 👨‍💻 Author

Hikmah Hashim

Frontend & Backend Developer

---

# 📄 License

This project is licensed under the MIT License.