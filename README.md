# Furniture System (Vitrax Home)

Full-stack furniture ecommerce system with:

- **Frontend:** React + Vite (`FRONTEND/vitrax-limited`)
- **Backend:** Flask + SQLAlchemy + Flask-Migrate (`BACKEND/server`)

This guide shows how to run the project from a **fresh GitHub clone**.

---

## 1) Prerequisites

Install these first:

- **Git**
- **Node.js 18+** and **npm**
- **Python 3.12**
- **Pipenv** (`pip install pipenv`)

Optional but useful:

- SQLite browser (for local DB inspection)
- Postman / Insomnia (API testing)

---

## 2) Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd Furniture-system
```

---

## 3) Backend setup (Flask)

Backend folder:

```bash
cd BACKEND
```

### 3.1 Install dependencies

```bash
pipenv install
```

### 3.2 Create backend environment file

Create `BACKEND/server/.env` and add required values.

Minimum required values:

```env
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
DATABASE_URL=sqlite:///vitraxlimited.db
```

Optional (only if you use these features now):

- Mail settings (`MAIL_SERVER`, `MAIL_PORT`, etc.)
- M-Pesa settings (`MPESA_CONSUMER_KEY`, etc.)
- Stripe settings (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)

> Note: `.env` is ignored by git and should never be committed.

### 3.3 Run database migrations

From `BACKEND` folder:

```bash
pipenv run flask --app server/app.py db upgrade
```

### 3.4 Start backend server

```bash
pipenv run python server/app.py
```

Backend runs on:

- `http://localhost:5000`

Quick test:

- Open `http://localhost:5000` in browser (should return `Hello, World!`)

---

## 4) Frontend setup (React + Vite)

Open a **new terminal** and run:

```bash
cd FRONTEND/vitrax-limited
npm install
```

### 4.1 Create frontend environment file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure it contains:

```env
VITE_API_URL=http://localhost:5000
```

### 4.2 Start frontend dev server

```bash
npm run dev
```

Frontend runs on:

- `http://localhost:5173` (default Vite port)

---

## 5) Daily run (after first setup)

### Terminal 1 (backend)

```bash
cd BACKEND
pipenv run python server/app.py
```

### Terminal 2 (frontend)

```bash
cd FRONTEND/vitrax-limited
npm run dev
```

---

## 6) Build for production (frontend)

```bash
cd FRONTEND/vitrax-limited
npm run build
```

Preview build:

```bash
npm run preview
```

---

## 7) Useful commands

### Backend

Run pending migrations:

```bash
cd BACKEND
pipenv run flask --app server/app.py db upgrade
```

Create a new migration:

```bash
pipenv run flask --app server/app.py db migrate -m "your message"
```

### Frontend

Lint:

```bash
cd FRONTEND/vitrax-limited
npm run lint
```

---

## 8) Environment & security notes

- Never commit:
  - `BACKEND/server/.env`
  - `FRONTEND/vitrax-limited/.env`
- Use `.env.example` as template for safe sharing.
- Rotate secrets immediately if they are ever exposed.

---

## 9) Common troubleshooting

### Port already in use

- Backend `5000` busy -> stop old process or change backend port in `server/app.py`.
- Frontend `5173` busy -> Vite usually picks next free port automatically.

### CORS errors

Backend currently allows common localhost origins (including `localhost:3000`).
If frontend is on a different origin/port, update CORS in:

- `BACKEND/server/app.py`

### `flask db` command fails

Make sure you run it from `BACKEND` and include app path:

```bash
pipenv run flask --app server/app.py db upgrade
```

### Frontend cannot reach backend

Check:

- Backend is running on `http://localhost:5000`
- Frontend `.env` has correct `VITE_API_URL`
- Restart frontend after changing `.env`

---

## 10) Project structure

```text
Furniture-system/
├─ BACKEND/
│  ├─ Pipfile
│  └─ server/
│     ├─ app.py
│     ├─ config.py
│     ├─ models.py
│     ├─ routes/
│     └─ migrations/
└─ FRONTEND/
   └─ vitrax-limited/
      ├─ package.json
      ├─ .env.example
      └─ src/
```

---

If you want, I can also add:

- a `BACKEND/server/.env.example` template,
- a one-command startup script for both frontend and backend,
- Docker setup (`docker-compose`) for fully reproducible local runs.
