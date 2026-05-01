# FleetPro API Documentation: v3.0

The FleetPro system exposes a comprehensive RESTful API for logistics orchestration. All requests (except authentication) require an `Authorization: Bearer <token>` header with a valid JWT token.

## Base URL
- **Production Endpoint**: `https://logistic-maitainance.onrender.com/api`
- **Development**: `http://localhost:3001/api`

## Authentication Gate

### `POST /api/auth/register`
Enrollment for new operators. Role assignment is restricted to `TECHNICIAN` by default for public registration.

### `POST /api/auth/login`
Validates credentials and returns a 24-hour scoped JWT.

---

## Strategic Dashboard (`/api/dashboard`)

### `GET /api/dashboard/stats`
Aggregated health and inventory metrics.
**Response Body:**
```json
{
  "equipment": 25,
  "operational": 18,
  "inMaintenance": 5,
  "outOfService": 2,
  "maintenance": 12,
  "activeMaintenance": 7,
  "lowStock": 3,
  "requisitions": 5
}
```

---

## User Management (ADMIN Protocol)

### `GET /api/users`
Returns a comprehensive list of system operators including active task loads.
**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@logistic.com",
    "role": "ADMIN",
    "assignedTasks": 0,
    "createdAt": "2026-04-24T00:00:00Z"
  },
  {
    "id": 2,
    "name": "John Tech",
    "email": "tech@logistic.com",
    "role": "TECHNICIAN",
    "assignedTasks": 4,
    "createdAt": "2026-04-24T00:00:00Z"
  }
]
```

### `PUT /api/users/:id/role`
Rotates the role of an operator.
**Payload:** `{ "role": "ADMIN" | "TECHNICIAN" }`

### `DELETE /api/users/:id`
Permanently removes an operator account.
**Note**: System blocks self-deletion of the active Admin session.

---

## Asset Lifecycle (`/api/equipment`)

### `GET /api/equipment`
Registry of physical assets with calculated 'Next Service' dates.

### `POST /api/equipment`
Admin-only registration of new fleet units.

---

## Inventory & Procurement

### `GET /api/inventory`
Stock tracking with supplier associations.

### `GET /api/requisitions`
Supply request list with multi-status and cost tracking.

### `PUT /api/requisitions/:id`
Approval/Rejection gateway for procurement requests (Admin specific).
