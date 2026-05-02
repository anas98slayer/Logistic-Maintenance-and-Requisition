# Full Project Report
## FleetPro: Logistics Maintenance and Requisition System

**Project Type:** Full-stack web application  
**Domain:** Logistics operations, equipment maintenance, inventory, and requisition control  
**Repository Reviewed:** `Logistic-Maintenance-and-Requisition`  
**Verification Basis:** Source code, Prisma schema, seed scripts, and build checks  
**Prepared On:** 2026-05-02

---

## 1. Executive Summary

FleetPro is a full-stack logistics management system built to help an organization manage four connected operational areas in one application:

- equipment tracking
- maintenance request handling
- inventory monitoring
- requisition submission and approval

The project uses a React frontend and an Express backend connected to a SQLite database through Prisma ORM. The system is role-based, with two primary actors:

- `ADMIN`
- `TECHNICIAN`

From a presentation point of view, the easiest way to explain the project is:

> FleetPro is a centralized digital platform for warehouse or fleet operations where admins supervise assets, inventory, and users, while technicians report faults, work on assigned maintenance, and request needed supplies.

---

## 2. Problem Statement

In a logistics or warehouse environment, operations are often handled through spreadsheets, phone calls, paper forms, or disconnected systems. That causes several problems:

- equipment problems are not tracked in one place
- maintenance tasks are difficult to assign and follow
- inventory shortages are noticed too late
- requisition approvals are manual and slow
- user responsibilities are not clearly controlled

FleetPro addresses this by putting those workflows into one role-aware web application.

---

## 3. Project Goals

The main goals of the system are:

- maintain a central registry of operational equipment
- let technicians create maintenance requests for equipment issues
- allow admins to assign maintenance tasks to technicians
- track stock items and identify low-stock conditions
- let users submit requisitions for needed supplies
- allow admins to approve, reject, or manage requisitions
- enforce authentication and role-based access
- provide a dashboard view of operational status

---

## 4. High-Level System Overview

At a high level, the system works like this:

```text
React Frontend
    ->
Express REST API
    ->
Prisma ORM
    ->
SQLite Database
```

### 4.1 Main User Roles

#### Admin

Admins are responsible for supervision and control. In the current implementation, an admin can:

- view all equipment, inventory, maintenance requests, requisitions, and users
- create new equipment records
- create inventory records
- assign technicians to maintenance requests
- update any maintenance request status
- delete maintenance requests
- approve, reject, or otherwise update requisition status
- delete requisitions
- view all users
- change user roles
- delete users except their own account

#### Technician

Technicians are operational users. In the current implementation, a technician can:

- register through the public signup form
- log in and access the protected application
- view dashboard data
- view equipment and inventory lists
- create maintenance requests
- update the status of maintenance requests assigned to them
- cancel their own pending request
- create requisitions

---

## 5. Technology Stack

### 5.1 Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI component primitives
- Lucide React icons
- Recharts for charts
- `motion/react` for auth-screen animation
- React Router

### 5.2 Backend

- Express 5
- TypeScript
- Prisma ORM
- SQLite
- `jsonwebtoken` for JWT auth
- `bcryptjs` for password hashing
- `cors`

### 5.3 Deployment-Oriented Files

- `netlify.toml` for frontend deployment
- `deployment-guide.md` for Netlify + Render deployment flow

---

## 6. Repository Structure

```text
.
├── src/                     Frontend application
│   ├── app/
│   │   ├── components/      Main pages and reusable UI
│   │   ├── context/         Auth context
│   │   ├── lib/             API helper
│   │   ├── App.tsx          App root
│   │   └── routes.ts        Client routes
│   └── styles/              Global styling, theme, fonts
├── server/                  Backend application
│   ├── prisma/
│   │   ├── schema.prisma    Database schema
│   │   ├── seed.ts          Active Prisma seed script
│   │   └── dev.db           Checked-in SQLite database
│   ├── src/
│   │   ├── lib/             Prisma client setup
│   │   ├── middleware/      JWT auth middleware
│   │   ├── routes/          REST route modules
│   │   └── index.ts         Express app entry
│   └── prisma.config.ts     Prisma config and seed command
├── documentation/           Project documentation
├── dist/                    Frontend build output
├── README.md
├── package.json
└── vite.config.ts
```

---

## 7. Frontend Architecture

The frontend is a single-page application.

### 7.1 Entry Point

The application starts in `src/main.tsx`, which renders `App`.

### 7.2 App Wrapper

`src/app/App.tsx` wraps the entire router in `AuthProvider`.

This means authentication state is globally available to all routes and components.

### 7.3 Authentication State

`src/app/context/AuthContext.tsx` stores:

- current user
- JWT token
- login function
- logout function
- loading state

Important behavior:

- auth state is persisted in `localStorage`
- if token and user exist in `localStorage`, the app restores the session on refresh
- there is no refresh-token flow

### 7.4 Routing

Client routes are defined in `src/app/routes.ts`:

- `/` -> Dashboard
- `/maintenance` -> Maintenance list
- `/requisitions` -> Requisition list
- `/equipment` -> Equipment list
- `/inventory` -> Inventory list
- `/users` -> User management

### 7.5 Route Protection Pattern

The app does not use a separate "ProtectedRoute" component. Instead, `Root.tsx` checks auth state:

- if auth is loading, it shows a loading screen
- if no user exists, it shows login or signup
- if user exists, it shows the dashboard shell

This means route access is UI-gated in the root layout.

### 7.6 Application Shell

`src/app/components/Root.tsx` creates:

- left sidebar navigation
- conditional admin-only navigation item for user management
- user profile card
- logout button
- outlet area for page content

### 7.7 API Layer

`src/app/lib/api.ts` is a small fetch wrapper that:

- uses `VITE_API_URL` if provided
- otherwise defaults to `http://localhost:3001/api`
- automatically sets `Content-Type: application/json`
- injects `Authorization: Bearer <token>` for protected requests
- throws a JavaScript `Error` when the backend responds with a failure

### 7.8 Main Frontend Modules

#### Login Page

`LoginPage.tsx`:

- collects email and password
- calls `POST /auth/login`
- stores token and user in `AuthContext`
- includes animated visual presentation

#### Signup Page

`SignupPage.tsx`:

- only registers technicians
- calls `POST /auth/register`
- shows a success state before switching back to login

#### Dashboard

`Dashboard.tsx` loads:

- dashboard stats
- equipment list
- inventory list

and presents:

- KPI summary cards
- equipment status pie chart
- static weekly bar chart
- fleet detail tab
- inventory alert tab
- workflow shortcut links

Important note:

- some dashboard values are live from the API
- some presentation elements are static or demo-oriented, such as the weekly performance chart and some trend labels

#### Maintenance Module

`MaintenanceList.tsx`:

- fetches maintenance requests and equipment
- fetches technicians if the user is admin
- allows technicians to create maintenance requests
- allows admins to assign technicians
- allows authorized users to update status
- allows admins to delete requests

#### Requisition Module

`RequisitionList.tsx`:

- fetches all requisitions
- allows technicians to create requisitions through the UI
- allows admins to update requisition status
- allows admins to delete requisitions

#### Equipment Module

`EquipmentList.tsx`:

- fetches all equipment
- allows admins to create new equipment
- allows admins to delete equipment
- shows schedule fields such as last and next maintenance

#### Inventory Module

`InventoryList.tsx`:

- fetches all inventory items
- highlights low stock
- allows admins to create inventory items
- allows admins to delete inventory items

#### User Management Module

`UserManagement.tsx`:

- visible only to admins in the UI
- fetches all users
- shows user roles and active task counts
- allows admin role changes
- allows admin deletion of users except the current account

### 7.9 UI and Styling Approach

The frontend uses:

- Tailwind utility classes
- theme variables from `src/styles/theme.css`
- a large set of reusable Radix-based components under `src/app/components/ui/`

This gives the project a polished dashboard look with reusable form, dialog, select, and badge components.

---

## 8. Backend Architecture

The backend is an Express REST API organized by route modules.

### 8.1 Entry Point

`server/src/index.ts`:

- loads environment variables
- creates the Express app
- enables CORS
- enables JSON body parsing
- logs every request with timestamp, method, and URL
- mounts all API route groups

Mounted route groups:

- `/api/auth`
- `/api/equipment`
- `/api/maintenance`
- `/api/requisitions`
- `/api/inventory`
- `/api/dashboard`
- `/api/users`

### 8.2 Authentication Middleware

`server/src/middleware/auth.ts` provides:

- `authenticateToken`
- `authorizeRole`

`authenticateToken`:

- reads the `Authorization` header
- extracts the bearer token
- verifies it using `JWT_SECRET`
- attaches user info to `req.user`

`authorizeRole`:

- checks whether the logged-in user has one of the allowed roles

### 8.3 Route Modules

#### Auth Routes

`server/src/routes/auth.ts`

Implements:

- `POST /register`
- `POST /login`
- `GET /me`

Key logic:

- passwords are hashed with bcrypt
- JWT tokens expire in 24 hours
- public registration defaults to `TECHNICIAN`
- technician registrations are capped at 5 users

#### Equipment Routes

`server/src/routes/equipment.ts`

Implements:

- `GET /`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

Access rules:

- any authenticated user can view equipment
- only admins can create, update, or delete

Important implementation note:

- when equipment is created, the backend stores `id`, `name`, `type`, `location`, and `status`
- `nextMaintenance` sent from the frontend is currently not saved by the create route

#### Maintenance Routes

`server/src/routes/maintenance.ts`

Implements:

- `GET /`
- `GET /technicians`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

Access rules:

- any authenticated user can view maintenance requests
- admin can fetch technician list
- only technicians can create requests
- admin can update any maintenance request
- technician can update only if:
  - the task is assigned to them and status is one of `In Progress`, `Completed`, or `Cancelled`
  - or they are the creator and want to cancel their own request
- only admin can delete requests

#### Inventory Routes

`server/src/routes/inventory.ts`

Implements:

- `GET /`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

Access rules:

- any authenticated user can view inventory
- only admin can create or delete
- update route is currently open to any authenticated user

Important implementation note:

- `PUT /inventory/:id` updates `quantity` and automatically sets `lastRestocked`
- the frontend currently does not expose a dedicated restock/edit form for this route

#### Requisition Routes

`server/src/routes/requisitions.ts`

Implements:

- `GET /`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

Access rules:

- any authenticated user can view requisitions
- any authenticated user can create a requisition at the API level
- only admins can update status or delete

Important implementation note:

- the UI shows requisition creation only for technicians, but the backend itself does not restrict creation to technicians

#### Dashboard Route

`server/src/routes/dashboard.ts`

Implements:

- `GET /stats`

This returns aggregate metrics such as:

- total equipment
- operational equipment
- equipment under maintenance
- out-of-service equipment
- total maintenance requests
- active maintenance requests
- low-stock items
- total requisitions

Important implementation note:

- low-stock counting is finalized in application code by fetching inventory and filtering items whose quantity is less than or equal to minimum stock

#### User Routes

`server/src/routes/users.ts`

Implements:

- `GET /`
- `PUT /:id/role`
- `DELETE /:id`

Access rules:

- admin only

Important safeguard:

- self-deletion is blocked

---

## 9. Database Design

The database schema is defined in `server/prisma/schema.prisma`.

There are five main models.

### 9.1 User

Purpose:

- stores login and role information

Core fields:

- `id`
- `email`
- `name`
- `password`
- `role`
- `createdAt`
- `updatedAt`

Relationships:

- creates maintenance requests
- can be assigned maintenance requests
- submits requisitions

### 9.2 Equipment

Purpose:

- stores tracked operational assets

Core fields:

- `id`
- `name`
- `type`
- `location`
- `status`
- `lastMaintenance`
- `nextMaintenance`

Relationships:

- one equipment item can have many maintenance requests

### 9.3 MaintenanceRequest

Purpose:

- stores a maintenance issue or task linked to a piece of equipment

Core fields:

- `id`
- `equipmentId`
- `type`
- `priority`
- `status`
- `assignedToId`
- `createdById`
- `createdDate`
- `dueDate`
- `description`

Relationships:

- belongs to one equipment item
- may have a creator user
- may have an assigned technician

### 9.4 Requisition

Purpose:

- stores requested supplies or items

Core fields:

- `id`
- `item`
- `category`
- `quantity`
- `unit`
- `status`
- `requestedById`
- `requestDate`
- `estimatedCost`

Relationships:

- belongs to one requesting user

### 9.5 InventoryItem

Purpose:

- stores inventory records and reorder thresholds

Core fields:

- `id`
- `name`
- `category`
- `quantity`
- `unit`
- `minStock`
- `location`
- `supplier`
- `lastRestocked`

---

## 10. Core Business Workflows

### 10.1 Login Workflow

1. User enters email and password in the login page.
2. Frontend sends credentials to `POST /api/auth/login`.
3. Backend validates the user and password.
4. Backend returns a JWT and user object.
5. Frontend stores both in `localStorage`.
6. App re-renders into the protected dashboard shell.

### 10.2 Technician Registration Workflow

1. New user opens the signup screen.
2. Frontend submits `name`, `email`, `password`, and role `TECHNICIAN`.
3. Backend checks whether the technician count has reached 5.
4. Backend hashes the password and creates the user.
5. Frontend shows success and returns to login.

### 10.3 Maintenance Request Workflow

1. Technician selects equipment and enters request details.
2. Frontend sends request to `POST /api/maintenance`.
3. Backend stores the request with `Pending` status and `createdById`.
4. Admin views the request list.
5. Admin assigns a technician by updating `assignedToId`.
6. Assigned technician updates status during work.
7. Admin can delete requests if needed.

### 10.4 Requisition Workflow

1. Technician creates a requisition.
2. Backend stores it with `Pending` status.
3. Admin reviews the requisition list.
4. Admin changes status to values such as `Approved`, `Ordered`, `Received`, or `Rejected`.

### 10.5 Inventory Monitoring Workflow

1. Admin creates inventory records with quantity and minimum stock.
2. Dashboard and inventory screen compare `quantity` vs `minStock`.
3. Items below threshold appear as low stock.

### 10.6 User Management Workflow

1. Admin opens the user management screen.
2. Frontend loads all users and their assigned-task counts.
3. Admin can change a user role.
4. Admin can delete a user unless it is their own account.

---

## 11. Current Seed Data and Demo State

### 11.1 Active Prisma Seed Script

The configured Prisma seed command comes from `server/prisma.config.ts` and points to:

- `server/prisma/seed.ts`

That script creates:

- 1 admin
- 2 technicians
- 5 equipment records
- 5 inventory items
- 4 maintenance requests
- 2 requisitions

### 11.2 Checked-In Database Snapshot

The checked-in SQLite file `server/prisma/dev.db` currently contains:

- 3 users
- 5 equipment records
- 5 inventory items
- 4 maintenance requests
- 2 requisitions

### 11.3 Important Seed Note

There is also a second file:

- `server/src/seed.ts`

This appears to be an older or alternate seed script with different sample credentials and smaller sample data. It is not the script currently configured in Prisma.

### 11.4 Demo Credentials Note

If the database is reseeded using the currently configured Prisma seed script in `server/prisma/seed.ts`, the password used there is:

- `password123`

Sample emails in that seed:

- `admin@fleetpro.com`
- `john.doe@fleetpro.com`
- `jane.smith@fleetpro.com`

---

## 12. Setup, Run, and Build Flow

### 12.1 Frontend

From the project root:

```bash
npm install
npm run dev
```

### 12.2 Backend

From `server/`:

```bash
npm install
npm run dev
```

### 12.3 Database

From `server/`:

```bash
npx prisma db seed
```

Environment variable required:

- `DATABASE_URL`

For local SQLite usage, this usually points to a file such as:

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 12.4 Build Verification

During this review:

- frontend build succeeded with `npm run build`
- backend build did not run successfully in the current workspace because `tsc` was not available in `server/` at execution time

This indicates the frontend dependencies are available, while backend dependencies may need installation in the local environment before build verification.

---

## 13. Deployment Design

The repo is structured for split deployment:

- frontend on Netlify
- backend on Render

`netlify.toml` shows:

- publish directory: `dist`
- build command: `npm run build`
- `VITE_API_URL` pointing to the hosted backend
- SPA redirect rules
- security-related headers

This is a standard deployment model for a React SPA + Node API project.

---

## 14. Strengths of the Project

The project has several strong points:

- clear separation between frontend and backend
- easy-to-understand route-based backend organization
- type-safe database access through Prisma
- practical role-based access control
- realistic operational modules for a logistics domain
- modern dashboard-style UI
- easy local setup through SQLite
- good demo value for academic presentation

---

## 15. Current Limitations and Implementation Gaps

This section is important because it explains the system honestly.

### 15.1 Validation Library Installed but Not Used

`zod` is listed as a dependency, but the current backend route files do not actually use Zod validation.

### 15.2 Auth Persistence Is Basic

The app stores token and user data in `localStorage`.

Current limitations:

- no refresh token
- no session revocation flow
- no password reset workflow

### 15.3 Some Backend Permissions Are Broader Than the UI Suggests

- requisition creation is open to any authenticated user at the API layer
- inventory update is open to any authenticated user at the API layer

The UI hides some of these actions, but the backend rules are looser than the UI implies.

### 15.4 Some CRUD Endpoints Are Not Fully Exposed in the Frontend

The backend supports update routes for:

- equipment
- inventory

but the current frontend mainly exposes create, view, and delete flows.

### 15.5 Equipment Scheduling Is Partially Implemented

The schema supports:

- `lastMaintenance`
- `nextMaintenance`

but:

- equipment create route does not persist `nextMaintenance`
- `lastMaintenance` is not automatically updated when maintenance is completed

### 15.6 Some Dashboard Content Is Demonstration-Oriented

The dashboard mixes live data with static presentation content, including:

- a hard-coded weekly performance bar chart
- fixed trend percentages on KPI cards
- hard-coded text such as warehouse counts

### 15.7 Business Logic Lives Directly in Route Files

This is acceptable for a course project, but for larger production systems it would be better to separate:

- controllers
- services
- validation
- repositories

### 15.8 Seed Duplication Can Cause Confusion

Two different seed scripts exist in the repository, which can confuse future developers unless one is removed or documented clearly.

---

## 16. How to Explain the Project in a Presentation

If you need to explain the whole project from scratch, use this order.

### 16.1 Short Intro

Start with:

> This project is a logistics maintenance and requisition management system. It helps admins and technicians manage equipment, maintenance jobs, stock items, and supply requests in one centralized platform.

### 16.2 Explain the Users

Say:

- Admin manages the full system
- Technician performs operational tasks

### 16.3 Explain the Four Main Modules

Use these four pillars:

1. Equipment management
2. Maintenance management
3. Inventory management
4. Requisition management

Then add:

5. Authentication and user management
6. Dashboard analytics

### 16.4 Explain the Technical Flow

Say:

> The frontend is built in React. It sends requests to an Express API. The backend applies authentication and role checks, then stores or retrieves data through Prisma from a SQLite database.

### 16.5 Explain a Real Example

A good walkthrough is:

1. Technician logs in
2. Technician creates a maintenance request for a faulty truck or forklift
3. Admin sees the request and assigns a technician
4. Technician updates status during the repair
5. If parts are needed, the technician submits a requisition
6. Admin approves the requisition
7. Inventory and dashboard help track operational readiness

### 16.6 Explain the Academic Value

Mention that the project demonstrates:

- full-stack development
- REST API design
- database modeling
- authentication and authorization
- modular frontend design
- real business workflow mapping

---

## 17. Suggested Demo Sequence

If you are showing the project live, use this order:

1. Login as admin
2. Show dashboard KPIs
3. Open equipment list
4. Open maintenance list and assign a technician
5. Open requisitions and update a status
6. Open inventory and show low-stock logic
7. Open user management and show role control
8. Logout
9. Login as technician
10. Show maintenance creation and requisition submission

---

## 18. Final Conclusion

FleetPro is a well-scoped full-stack project that connects logistics asset management, maintenance operations, inventory tracking, and requisition handling into a single web-based system.

Its biggest strengths are clarity, practical workflow coverage, and a clean full-stack structure that is easy to explain in an academic or demo setting.

Its biggest improvement opportunities are stronger backend validation, tighter permission enforcement, fuller CRUD support, and better synchronization between maintenance activity and equipment service dates.

Overall, the project is a solid demonstration of how a modern web application can digitize operational processes in a logistics environment.
