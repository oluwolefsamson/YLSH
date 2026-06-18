# YLSH — Young Leaders Summit Hub

A full-stack platform for managing the Young Leaders Summit: event registration, QR check-in, certificate issuance, mentorship, learning resources, and opportunities — all under one roof with role-based access.

---

## The Problem It Solves

Running a large-scale youth leadership summit involves coordinating dozens of moving parts: verifying participant identities, tracking event attendance, issuing certificates, matching mentors with mentees, and managing applications for opportunities. Doing this manually — spreadsheets, paper forms, email threads — is error-prone and doesn't scale.

YLSH replaces that chaos with a single platform where:
- Participants register once with their NIN and get access to everything
- Admins manage events, check-in attendees via QR, and issue certificates in bulk
- Mentors set their availability and manage sessions from a dedicated portal
- Super admins have full visibility into the platform with audit logs and analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (TypeScript), Tailwind CSS |
| Backend | Node.js, Express (TypeScript) |
| Database | MongoDB (Mongoose) |
| Auth | JWT (HTTP Bearer) |
| Email | Resend |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
ylsh/
├── frontend/          # Next.js app (Vercel)
└── backend/           # Express API (Render)
```

---

## Roles & What Each Can Do

The platform has four roles in ascending order of privilege.

### Participant
The default role for anyone who signs up.
- Register for events and receive a QR code for check-in
- Download and share issued certificates
- Discover and book mentorship sessions
- Apply for jobs, internships, grants, and scholarships
- Access learning resources (videos, PDFs, articles) with progress tracking
- Manage their profile

### Mentor
A participant who applied as a mentor and was approved by an admin.
- Everything a Participant can do
- Set a public mentor profile (headline, skills, category, bio)
- Configure weekly availability (days, hours, max sessions)
- Accept or decline session requests from participants
- Record session outcomes and ratings
- View mentee history and session statistics

> Mentors land on a **Pending** page after signup until an Admin approves their application.

### Admin
Staff members who manage the day-to-day operations of the summit.
- Everything a Participant can do
- **Users** — search, filter, suspend, or delete accounts; approve/decline mentor applications
- **Events** — create, update, delete events; track registrations and capacity
- **Check-in** — scan participant QR codes to mark attendance
- **Certificates** — issue certificates individually or in bulk for an entire event
- **Opportunities** — post and manage job/internship/grant/scholarship listings; move applications through review stages
- **Speakers & Volunteers** — manage speaker profiles and event volunteer roles
- **Learning** — publish and manage learning resources
- **Analytics** — user growth, event stats

### Super Admin
The platform owner with full system access.
- Everything an Admin can do
- **Role Management** — assign or revoke any role on any account
- **Create Admin accounts** — provision new admin users
- **Audit Logs** — see a timestamped record of every significant action taken on the platform
- **Platform Analytics** — role distribution, geographic breakdown by state
- **Super Dashboard** — aggregated stats across the entire platform

---

## Core Workflows

### 1. Registration & Identity Verification

```
Signup → Enter NIN (11 digits) → Personal info → Set password → Account created
```

Every user provides their National Identification Number (NIN) during signup. The platform validates the format and ensures no duplicate NIN registrations, so each real person maps to exactly one account.

---

### 2. Event Registration & QR Check-In

```
Browse Events → Register → Receive QR Token → Attend Event → Admin Scans QR → Marked Attended
```

Each registration auto-generates a unique QR token (`YLS-XXXX-XX`). At the event venue, admins scan the QR from the participant's dashboard to mark them as attended. The system records who checked in and when.

---

### 3. Certificate Issuance & Verification

```
Event Ends → Admin issues batch certificates → Participants download → Anyone verifies via public URL
```

After an event, admins run a batch certificate generation for all attendees. Each certificate gets a unique verification code (`YLSH-CERT-XXXXXX`). Certificates are publicly verifiable at `/verify/[code]` — no login required — so participants can share them with employers or institutions.

---

### 4. Mentorship

```
Participant registers as Mentor → Admin approves → Mentor sets availability
→ Participant books session → Session scheduled → Outcome recorded → Both rate
```

Mentors publish a profile with their skills and availability windows. Participants browse mentors by category and send a session request with a topic and preferred time. The mentor confirms, shares a meeting link, and after the session records outcomes. Both sides can leave ratings.

---

### 5. Opportunities

```
Admin posts opportunity → Participant applies with cover letter
→ Admin moves application through stages → Participant tracks status
```

Opportunity types: **Job**, **Internship**, **Grant**, **Scholarship**. Applications go through stages: `pending → under_review → shortlisted → accepted / rejected`. Participants can track all their applications from their dashboard.

---

### 6. Learning Resources

```
Admin publishes resource (video/PDF/article) → Participant accesses it
→ Platform tracks progress (0–100%) → Participant sees completion across all resources
```

---

## Navigating the Application

### Sign In
Go to `/signin`. Choose your role (Participant, Mentor, Admin, or Super Admin), then enter your email and password.

> The role selector is cosmetic for routing purposes — the backend validates your actual role from the database.

### Sign Up
Go to `/signup`. Three steps:
1. **Verify NIN** — enter your 11-digit National ID Number
2. **Personal info** — name, email, phone, organisation
3. **Account details** — choose role (Participant or Mentor), set username and password

---

### Participant Dashboard (`/dashboard`)

| Page | Path | What's There |
|---|---|---|
| Overview | `/dashboard` | Stats, upcoming events, quick actions |
| Events | `/dashboard/events` | Browse, register, view QR code |
| Certificates | `/dashboard/certificates` | Download and verify certificates |
| Mentorship | `/dashboard/mentorship` | Find mentors, book and track sessions |
| Opportunities | `/dashboard/opportunities` | Browse and apply, track applications |
| Learning | `/dashboard/learning` | Resources with progress tracking |
| Profile | `/dashboard/profile` | Edit personal details and photo |

---

### Mentor Portal (`/mentor`)

| Page | Path | What's There |
|---|---|---|
| Dashboard | `/mentor` | Session stats, upcoming sessions |
| Sessions | `/mentor/sessions` | Manage all sessions, add outcomes |
| Mentees | `/mentor/mentees` | List of all assigned mentees |
| Profile | `/mentor/profile` | Edit public mentor profile |
| Availability | `/mentor/availability` | Set days, hours, max sessions |
| Pending | `/mentor/pending` | Shown while awaiting approval |

---

### Admin Portal (`/admin`)

| Page | Path | What's There |
|---|---|---|
| Dashboard | `/admin` | Platform health metrics and recent activity |
| Users | `/admin/users` | Search, filter, suspend, approve mentors |
| Events | `/admin/events` | Create and manage events |
| Analytics | `/admin/analytics` | Growth charts, event stats, audit trail |
| Verifications | `/admin/verifications` | Pending identity verifications |

---

### Super Admin Portal (`/super-admin`)

| Page | Path | What's There |
|---|---|---|
| Dashboard | `/super-admin` | Full platform stats and audit log |
| Users | `/super-admin/users` | All users with role assignment |
| Roles | `/super-admin/roles` | RBAC matrix and role assignment interface |
| Analytics | `/super-admin/analytics` | Role distribution, state breakdown |
| Events | `/super-admin/events` | Full event controls |

---

### Public Pages

| Page | Path | What's There |
|---|---|---|
| Certificate Verify | `/verify/[code]` | Publicly verify any certificate by its code — no login needed |

---

## API Overview

All API routes are prefixed `/api/`.

| Prefix | Resource |
|---|---|
| `/api/auth` | Login, register, NIN verify, profile |
| `/api/users` | User management, mentor approval, admin creation |
| `/api/events` | Event CRUD, registration |
| `/api/registrations` | User registrations, QR check-in |
| `/api/certificates` | Issue, batch-issue, verify |
| `/api/mentors` | Mentor profiles, session requests |
| `/api/sessions` | Session lifecycle, outcomes, ratings |
| `/api/opportunities` | Listings and applications |
| `/api/learning` | Resources and progress |
| `/api/analytics` | Dashboards and audit logs |
| `/api/speakers` | Speaker profiles |
| `/api/volunteers` | Volunteer applications |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL (for CORS and email links) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Sender address (e.g. `YLSH Platform <onboarding@resend.dev>`) |
| `NODE_ENV` | `development` or `production` |
| `SUPER_ADMIN_EMAIL` | Email seeded as super-admin on startup |
| `SUPER_ADMIN_PASSWORD` | Password for the seeded super-admin |
| `SUPER_ADMIN_FIRST_NAME` | First name for seeded super-admin |
| `SUPER_ADMIN_LAST_NAME` | Last name for seeded super-admin |

### Frontend (`frontend/.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL |

---

## Running Locally

```bash
# Backend
cd backend
npm install
npm run dev        # runs on http://localhost:8000

# Frontend
cd frontend
npm install
npm run dev        # runs on http://localhost:3000
```

> Without `RESEND_API_KEY` set in `backend/.env`, emails are logged to the console instead of being sent — useful for local development.

---

## Deployment

| Service | Platform | Auto-deploy trigger |
|---|---|---|
| Frontend | Vercel | Push to `main` |
| Backend | Render | Push to `main` |

The super-admin account is seeded automatically on every backend startup using the `SUPER_ADMIN_*` environment variables. If the account already exists, the seed is skipped.
