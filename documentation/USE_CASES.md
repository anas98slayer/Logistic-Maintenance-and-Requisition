# Use Case Analysis

This document describes the comprehensive use cases for the FleetPro: Logistics Maintenance Management System, categorized by user roles and system functionality.

## Use Case Diagram

```mermaid
useCaseDiagram
    actor Admin
    actor Technician
    
    package "FleetPro System" {
        usecase "User Authentication" as UC1
        usecase "View Enhanced Dashboard" as UC2
        usecase "Manage Equipment Registry" as UC3
        usecase "Manage Inventory System" as UC4
        usecase "Create Maintenance Request" as UC5
        usecase "Update Maintenance Status" as UC6
        usecase "Submit Supply Requisition" as UC7
        usecase "Approve/Reject Requisitions" as UC8
        usecase "Manage User Accounts" as UC9
        usecase "Assign Maintenance Tasks" as UC10
        usecase "Monitor Fleet Health" as UC11
        usecase "Track Inventory Thresholds" as UC12
        usecase "Generate Operations Reports" as UC13
        usecase "System Seeding" as UC14
    }
    
    Technician --> UC1
    Technician --> UC2
    Technician --> UC5
    Technician --> UC6
    Technician --> UC7
    Technician --> UC11
    Technician --> UC12
    
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
```

## Use Case Descriptions

### UC1: User Authentication
- **Actors**: Admin, Technician
- **Description**: Allows users to securely access the system. Registration includes name, email, and password. Login provides a JWT token for RBAC-enforced API interactions.
- **Preconditions**: User has valid credentials or requires enrollment.
- **Normal Flow**: 
  1. User navigates to FleetPro login portal.
  2. User enters credentials.
  3. System validates via bcrypt and provides scoped JWT.
  4. User is directed to the interactive dashboard.

### UC2: View Enhanced Dashboard
- **Actors**: Admin, Technician
- **Description**: Users access a high-fidelity dashboard with real-time KPI synthesis. It includes specific drill-down tabs:
  - **Overview**: High-level charts and global KPIs.
  - **Fleet Health**: Detailed equipment matrix and service locations.
  - **Inventory**: Critical item tracking and threshold monitoring.
- **Preconditions**: Valid Session.
- **Normal Flow**:
  1. User loads Dashboard.
  2. System fetches real-time aggregations.
  3. User toggles between analytical views (Fleet Health/Inventory).

### UC9: Manage User Accounts (Admin Only)
- **Actors**: Admin
- **Description**: Strategic management of system operators through a dedicated administrative interface.
- **Features**:
  - View all registered users with their task counts.
  - Rotate roles (Admin <-> Technician).
  - Delete retired accounts (preventing self-deletion to ensure system security).
- **Normal Flow**:
  1. Admin navigates to 'User Management' in the sidebar.
  2. Admin reviews the operator list and their operational load.
  3. Admin performs necessary role optimizations or account removals.

### UC11: Monitor Fleet Health
- **Actors**: Admin, Technician
- **Description**: Real-time monitoring of asset viability using a detailed matrix including "Next Service" calculations and current operational status (Maintenance, Operational, Out of Service).
- **Normal Flow**:
  1. User accesses Fleet Health tab.
  2. System identifies equipment approaching service thresholds.
  3. User creates a maintenance workflow directly from the view.

### UC14: System Seeding
- **Actors**: Developer/Admin
- **Description**: Populates the production database with high-fidelity synthetic data to simulate a live warehouse environment.
- **Data Includes**: Multi-role users, cross-category equipment, and tiered inventory with pre-calculated thresholds.
