# Student Tracking System

A full-stack school management system: Node.js/Express/MongoDB backend with
role-based access control (Admin, Teacher, Student/Parent), and a React
(Vite) frontend. This matches the architecture, schema, and roles design
covered in the accompanying lectures.

```
school-management-system/
├── backend/     Express API + MongoDB (Mongoose)
└── frontend/    React (Vite) client
```

## What's included

- **Students**: full CRUD, admin-only create/edit/delete, teachers see only their class
- **Attendance**: mark present/absent/late by class and date, with an attendance % summary
- **Grades**: record marks per subject/exam/term, with an average % summary
- **Events**: school-wide (admin) or class-level (teacher) events
- **Dashboard**: role-scoped stats + a low-attendance alert list (< 75%)
- **Auth**: JWT login, password hashing (bcrypt), and role-based route guards
  on both the backend (`requireRole` middleware) and frontend (`ProtectedRoute`)

## Roles

| Role | Can do |
|---|---|
| **admin** | Everything — manage students, staff, all classes, all events, all reports |
| **teacher** | Manage their own assigned class(es): mark attendance, record grades, create class-level events |
| **parent** | Read-only view of their own child's attendance, grades, and the event calendar |

---

## 1. Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- A MongoDB database — the easiest option is a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (get a connection string from there)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGODB_URI` — your Atlas (or local) connection string
- `JWT_SECRET` — any long random string
- `CLIENT_ORIGIN` — leave as `http://localhost:5173` for local dev

Create your first admin account (there's no public signup for admin/teacher
accounts — that's intentional, see the Roles lecture):

```bash
node seed-admin.js
```

This prints a default admin email/password. **Log in and change the password
immediately in a real deployment.**

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000/api`. Check it's alive:

```bash
curl http://localhost:5000/api/health
```

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) and log in with the
admin credentials from `seed-admin.js`.

## 4. Typical first session

1. Log in as admin.
2. Go to **Students** → add a few students (set their `class`, e.g. `10-B`).
3. Use `POST /api/auth/register-staff` (as admin, e.g. via Postman or curl)
   to create a teacher account with `assignedClasses: ["10-B"]`.
4. Log in as that teacher → go to **Attendance** → mark a class → **Grades** → record marks.
5. Create a parent account via the **Sign up** flow (parents can self-signup,
   since that role has no special access) — then, as admin, add that
   student's `_id` to the parent's `children` array (directly in the DB for
   now; a "link my child" admin UI would be a natural next feature).

## 5. API overview

All routes are prefixed with `/api`. All routes except `/auth/signup` and
`/auth/login` require an `Authorization: Bearer <token>` header.

| Method | Route | Who |
|---|---|---|
| POST | `/auth/signup` | Public (creates a parent account) |
| POST | `/auth/login` | Public |
| POST | `/auth/register-staff` | Admin only |
| GET | `/auth/me` | Any logged-in user |
| GET/POST/PUT/DELETE | `/students` | Admin (all), Teacher (read, own class) |
| POST | `/attendance` | Admin, Teacher |
| GET | `/attendance/student/:id` | Scoped per role |
| GET | `/attendance/class/:className` | Admin, Teacher |
| POST/PUT | `/grades` | Admin, Teacher |
| GET | `/grades/student/:id` | Scoped per role |
| GET/POST/DELETE | `/events` | View: everyone. Create: Admin/Teacher. Delete: Admin |
| GET | `/dashboard` | Any logged-in user, scoped per role |

## 6. What's intentionally left as a next step

This is a solid, working foundation — matching everything covered in the
Project Flow and Roles lectures — but a few things from the full roadmap
were left out to keep this buildable and reviewable in one pass:

- Email alerts (Nodemailer) and scheduled/cron-based alerts
- A calendar UI library (FullCalendar) for the Events page — currently a list view
- File uploads (student photos)
- Pagination for large student lists
- An admin UI for linking a parent account to their child (currently manual)

Each of these follows the same "repeating pattern" from the Project Flow
lecture — model → route → frontend piece → connect → test — so you can add
them the same way everything else here was built.
