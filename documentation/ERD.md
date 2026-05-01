# Entity Relationship Diagram (ERD)
## for FleetPro: Logistics Maintenance Management System

This document details the database architecture of FleetPro. The system utilizes SQLite with Prisma ORM, implementing 5 primary models designed for high-integrity logistics operations.

## Database Schema Model

```mermaid
erDiagram
    USER ||--o{ MAINTENANCE_REQUEST : "reports"
    USER ||--o{ MAINTENANCE_REQUEST : "isAssigned"
    USER ||--o{ REQUISITION : "submits"
    EQUIPMENT ||--o{ MAINTENANCE_REQUEST : "associatesWith"
    
    USER {
        int id PK "SerialID"
        string email UK "Secure Login"
        string name
        string password "Hashed"
        string role "ADMIN | TECHNICIAN"
        datetime createdAt
        datetime updatedAt
    }
    
    EQUIPMENT {
        string id PK "UUID"
        string name
        string type
        string location
        string status "Operational | Maintenance | OutOfService"
        datetime lastMaintenance
        datetime nextMaintenance
    }
    
    MAINTENANCE_REQUEST {
        string id PK "UUID"
        string equipmentId FK
        string type
        string priority "Low-Critical Tier"
        string status "Pending-Cancelled Workflow"
        int assignedToId FK "Technician Assoc"
        int createdById FK "Originator Assoc"
        datetime createdDate
        datetime dueDate
        string description
    }
    
    REQUISITION {
        string id PK "UUID"
        string item
        string category
        int quantity
        string unit
        string status "Workflow Approval"
        int requestedById FK
        string estimatedCost
    }
    
    INVENTORY_ITEM {
        string id PK "UUID"
        string name
        string category
        int quantity
        string unit
        int minStock "Threshold"
        string location
        string supplier
        datetime lastRestocked
    }
```

## Architectural Decoupling & Constraints

### 1. User Orchestration (RBAC)
- **Role Assignment**: Managed via the `role` enum. Access to `/api/users` is restricted to `ADMIN` tokens.
- **Relational Integrity**: Deleting a `USER` record requires checking for active `assignedTasks`. Admin deletion is restricted at the route level.

### 2. Asset Lifecycle (Equipment)
- **State Machine**: Equipment status updates automatically trigger dashboard health recalculations.
- **Cascading Logic**: Deleting `EQUIPMENT` cascades to its `MAINTENANCE_REQUEST` history to ensure data cleanliness.

### 3. Supply Chain (Inventory & Requisitions)
- **Threshold Alerts**: `quantity <= minStock` triggers the 'Low Stock' flag in the Dashboard Inventory tab.
- **Accountability**: `REQUISITION` records are hard-linked to `USER` for auditing purposes.

## Security & Performance
- **Indexing**: Frequent filters on `status`, `equipmentId`, and `email` are indexed for sub-100ms lookup.
- **Concurrency**: Prisma's transaction engine handles state transitions for approval workflows securely.
