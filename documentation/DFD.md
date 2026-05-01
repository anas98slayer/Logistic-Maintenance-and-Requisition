# Data Flow Diagrams (DFD)
## FleetPro: Logistics Maintenance Management System

This document illustrates the flow of data through the FleetPro system, from external entities to internal processes and data stores.

---

## Level 0: Context Diagram
The Context Diagram shows the system as a single process and its interaction with external entities (Users).

```mermaid
graph LR
    User([Operators: Admin/Technician])
    
    subgraph System ["FleetPro System"]
        Process((Logistics & <br/>Maintenance <br/>Management))
    end
    
    User -- "Login Credentials" --> Process
    User -- "Asset Updates" --> Process
    User -- "Maintenance Requests" --> Process
    User -- "Supply Requisitions" --> Process
    
    Process -- "Auth Token" --> User
    Process -- "Health Analytics" --> User
    Process -- "Operational Reports" --> User
    Process -- "Inventory Alerts" --> User
```

---

## Level 1: Functional Decomposition
The Level 1 DFD breaks down the main system into primary functional processes and shows data stores.

```mermaid
graph TD
    User([Operators])
    
    %% Processes
    P1((1.0 <br/>Authentication))
    P2((2.0 <br/>Dashboard <br/>Analytics))
    P3((3.0 <br/>Maintenance <br/>Management))
    P4((4.0 <br/>Inventory <br/>Control))
    P5((5.0 <br/>User <br/>Management))
    
    %% Data Stores
    D1[(Users Store)]
    D2[(Equipment Store)]
    D3[(Maintenance Store)]
    D4[(Inventory Store)]
    D5[(Requisitions Store)]
    
    %% Flows
    User -- Credentials --> P1
    P1 -- Validate --> D1
    P1 -- Token --> User
    
    D2 -- Asset Data --> P2
    D3 -- Task Data --> P2
    D4 -- Stock Levels --> P2
    P2 -- Real-time Stats --> User
    
    User -- Log Request --> P3
    P3 -- Store/Update --> D3
    P3 -- Update Status --> D2
    
    User -- Submit Requisition --> P4
    P4 -- Logic/Check --> D4
    P4 -- Requisition Log --> D5
    D5 -- Approval Flow --> User
    
    User -- Role Rotation --> P5
    P5 -- Update/Delete --> D1
    D1 -- Profile Data --> P5
```

---

## Data Flow Descriptions

### 1.0 Authentication
- **Input**: User login credentials (email/pw).
- **Internal**: bcrypt comparison and JWT signing.
- **Output**: Bearer session token.

### 2.0 Dashboard Analytics
- **Input**: Raw counts from all data stores.
- **Logic**: Aggregation and threshold checking (e.g., quantity < minStock).
- **Output**: Multi-tab visual metrics (Fleet Health, Inventory).

### 3.0 Maintenance Management
- **Input**: Equipment IDs, priorities, and assigned technician IDs.
- **Logic**: State transition management (Pending -> In Progress -> Completed).
- **Update**: Modifies Equipment status to "Under Maintenance" during active tasks.

### 4.0 Inventory Control
- **Input**: Stock quantities and replenishment requisitions.
- **Output**: Automated alerts for items below critical thresholds.

### 5.0 User Management
- **Input**: Administrative commands to delete or promote users.
- **Safety**: Validates that no admin is attempting self-deletion.
