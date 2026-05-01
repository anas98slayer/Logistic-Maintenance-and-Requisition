# Software Requirements Specification (SRS)
## for FleetPro: Logistics Maintenance Management System

**Version:** 3.0  
**Date:** April 24, 2026  
**Project Name:** FleetPro (Logistics Maintenance Management System)  
**Status:** Implementation Verified

---

## 1. Introduction
### 1.1 Purpose
This document provides a comprehensive description of the FleetPro system, a premium full-stack web application designed for logistics warehouse operations. It details the system's functionality, constraints, interfaces, and implementation specifications.

### 1.2 Document Conventions
- Standard IEEE 830 SRS template is followed throughout this document.
- Requirement IDs follow the format REQ-XXX with sequential numbering.
- User roles are consistently capitalized (ADMIN, TECHNICIAN).
- Technical terms are defined in the glossary (Appendix A).

### 1.3 Intended Audience and Reading Suggestions
**Primary Audience:** Software Engineering instructors and academic reviewers.  
**Secondary Audience:** Development team members and C-suite stakeholders.

### 1.4 Product Scope
FleetPro is a production-ready enterprise solution that manages equipment maintenance, critical inventory tracking, and team orchestration. It features a high-fidelity dashboard with predictive health monitoring, a robust requisition workflow, and administrative user lifecycle management.

---

## 2. Overall Description
### 2.1 Product Perspective
FleetPro is a standalone 3-tier web application. It implements a modern technology stack (React + Express + Prisma + SQLite) with comprehensive security measures and Role-Based Access Control (RBAC).

### 2.2 Product Functions
- **User Authentication & Authorization**: Secure JWT-based login with encrypted credentials and role-specific permissions.
- **Enhanced Dashboard Analytics**: Real-time visualization with dedicated tabs for **Fleet Health** (breakdown by location/next service) and **Inventory** (critical stock tracking).
- **Asset Orchestration**: Complete registry of logistics assets with color-coded health monitoring and scheduled maintenance.
- **Supply Chain Management**: Inventory tracking with automated low-stock flagging and restock tracking.
- **Requisition Engine**: Multi-stage supply request submission and administrative approval workflow.
- **Administrative Control Panel**: Dedicated interface for managing system users, role rotations, and account lifecycle.

### 2.3 User Characteristics
- **ADMIN**: Strategic access including user management, inventory deletion, requisition approval, and total system configuration.
- **TECHNICIAN**: Operational access to equipment status, maintenance logging, and supply requisition submission.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements
- **3.1.1 User Interfaces**: Premium React dashboard utilizing Tailwind CSS v4, Lucide icons, and Motion for micro-animations.
- **3.1.2 Software Interfaces**: Prisma ORM for database abstraction, Express REST API for communication.

### 3.2 Functional Requirements

#### 3.2.1 Authentication & User Management
- **REQ-001**: System shall allow registration with email validation and role assignment.
- **REQ-002**: System shall implement JWT-based authentication with 24-hour expiration.
- **REQ-003**: Admins shall have a dedicated **User Management** panel to view all operators, update roles, or delete inactive accounts.
- **REQ-004**: System shall strictly prevent administrative self-deletion to ensure system continuity.
- **REQ-005**: System shall limit technician registrations to a maximum of 5 concurrent profiles to prevent licensing abuse.

#### 3.2.2 Dashboard & KPI Monitoring
- **REQ-006**: System shall display dynamic KPI cards for Active Maintenance, Pending Requisitions, Total Assets, and Low Stock.
- **REQ-007**: System shall provide a **Fleet Health Tab** showing a detailed matrix of equipment status and physical locations.
- **REQ-008**: System shall provide an **Inventory Tab** highlighting items currently at or below critical stock thresholds.
- **REQ-009**: System shall utilize interactive Recharts (Pie/Bar) for visualizing equipment distribution and maintenance trends.

#### 3.2.3 Operational Maintenance
- **REQ-010**: Users shall generate maintenance requests with equipment links, priority tiers, and scheduled completion dates.
- **REQ-011**: System shall track the "Next Service" date for all equipment based on maintenance history.
- **REQ-012**: Admins shall assign specific tasks to technicians, while technicians can only update status for assigned workflows.

#### 3.2.4 Inventory & Requisitions
- **REQ-013**: System shall track inventory including quantity, unit types, and minimum replenishment levels.
- **REQ-014**: Requisitions shall support estimated cost tracking and multi-status lifecycles (Pending/Approved/Rejected).

### 3.3 Performance & Security
- **3.3.1 Security**: All protected routes require valid Bearer token verification via middleware.
- **3.3.2 Speed**: Dashboard data aggregation queries shall execute in <200ms.
- **3.3.3 Reliability**: Database constraints ensure referential integrity for all asset-related transactions.

---

## Appendices
### Appendix A: Implementation Summary
- **Seed Profile**: Admin (admin@logistic.com / admin123) and Technicians (tech@logistic.com / tech123).
- **Analytics Engine**: Powered by `recharts` for visual data synthesis.
- **Architecture**: Modular Component model with dedicated Context providers for Auth.

### Appendix B: Documentation Links
- **Data Flow Diagrams (Level 0, 1)**: `documentation/DFD.md`
- **Entity Relationship Diagram**: `documentation/ERD.md`
- **Use Case Walkthrough**: `documentation/USE_CASES.md`
- **Deployment Guide**: `deployment-guide.md`
