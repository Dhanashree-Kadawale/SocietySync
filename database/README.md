# SocietySync — Database Architecture & Setup Guide

This directory documents the database design, schema conventions, multi-tenancy model, and setup instructions for **SocietySync** — an enterprise-grade multi-housing society management system.

---

## 🏛️ Architecture Overview

SocietySync is engineered to support **multiple residential housing societies** on a single unified platform. Every society is an autonomous tenant within the shared database schema, ensuring strict data segregation while enabling high-performance operations and centralized Super Admin management.

```
                               ┌────────────────────────────────┐
                               │       Super Admin Console       │
                               │   (Cross-Society Governance)    │
                               └────────────────┬───────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
  ┌───────────────────────────────┐                             ┌───────────────────────────────┐
  │ Society A: Greenwood Heights   │                             │ Society B: Palm Meadows       │
  │ (society_id = 1)              │                             │ (society_id = 2)              │
  ├───────────────────────────────┤                             ├───────────────────────────────┤
  │ • Buildings (Wings A, B, C)   │                             │ • Towers (1, 2, 3, 4, 5, 6)   │
  │ • Flats (A-101, A-204, ...)   │                             │ • Flats (T1-101, T3-802, ...) │
  │ • Residents & Staff           │                             │ • Residents & Staff           │
  │ • Complaints & Notices        │                             │ • Complaints & Notices        │
  │ • Maintenance Bills & Dues    │                             │ • Maintenance Bills & Dues    │
  │ • Facility Bookings & Guests  │                             │ • Facility Bookings & Guests  │
  └───────────────────────────────┘                             └───────────────────────────────┘
```

---

## 📐 Schema & Naming Conventions

All tables, columns, indexes, and constraints follow strict engineering standards:

| Element | Convention | Example |
|---|---|---|
| **Table Names** | Plural, lowercase `snake_case` | `societies`, `maintenance_bills`, `facility_bookings` |
| **Primary Keys** | Single surrogate `id` of type `BIGINT AUTO_INCREMENT` | `id BIGINT AUTO_INCREMENT PRIMARY KEY` |
| **Foreign Keys** | Singular entity name + `_id` | `society_id`, `flat_id`, `resident_id`, `assigned_staff_id` |
| **Unique Keys** | Prefix `uq_` + `<table_or_entity>_<columns>` | `uq_flats_building_number`, `uq_poll_user_vote` |
| **Index Names** | Prefix `idx_` + `<table>_<column>` | `idx_complaints_society`, `idx_bills_month_year` |
| **Monetary Amounts** | Exact `DECIMAL(10, 2)` or `DECIMAL(12, 2)` | `total_amount DECIMAL(10, 2) NOT NULL` |
| **Timestamps** | UTC timestamp with automatic update triggers | `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`, `updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` |
| **Status Fields** | Uppercase string codes for maintainability | `'ACTIVE'`, `'PENDING'`, `'RESOLVED'`, `'OVERDUE'` |

---

## 🗂️ Domain Entity & Table Directory

The database consists of **24 normalized tables** grouped into 3 operational domains:

### 1. Multi-Society & Identity Core (`V1`)
- **`societies`**: Multi-tenant root organization table. Stores society registration, location, scale, subscription plan, and status.
- **`society_verifications`**: Verification queue for incoming society registration applications reviewed by Super Admins.
- **`roles`**: System authority definitions (`ROLE_SUPER_ADMIN`, `ROLE_SECRETARY_ADMIN`, `ROLE_RESIDENT`, `ROLE_MAINTENANCE_STAFF`).
- **`users`**: Platform user accounts with password hashes, 2FA status, and tenant links.
- **`user_roles`**: Many-to-many relationship mapping users to security roles.
- **`buildings`**: Wings, blocks, or towers belonging to a society.
- **`flats`**: Individual housing units/apartments, including BHK type, carpet area, parking slot, and occupancy status.
- **`residents`**: Resident profiles (owners or tenants) linked to flats and user accounts.
- **`staff`**: On-site management, security, and maintenance technicians.

### 2. Operations & Amenities (`V2`)
- **`complaints`**: Resident ticket tracking with priority, category (Civil, Plumbing, Electrical), status, and staff assignment.
- **`maintenance_bills`**: Invoices for society dues including base fees, sinking fund, water charges, parking fees, and penalties.
- **`payments`**: Digital payment audit records with transaction IDs, payment methods (UPI, Cards, Net Banking), and receipt references.
- **`facilities`**: Community amenities (Clubhouse, Swimming Pool, Tennis Court, Gym).
- **`facility_bookings`**: Time slot reservations for community amenities.
- **`visitors`**: Gatekeeper log and visitor passes with status tracking (`EXPECTED`, `CHECKED_IN`, `APPROVED`, `CHECKED_OUT`).

### 3. Communications, Governance & Administration (`V3`)
- **`notices`**: Digital notice board announcements with category tags, urgency levels, and pin-to-top flags.
- **`society_documents`**: Repository for society bylaws, AGM minutes, audit reports, and NOC templates.
- **`expenses`**: Society ledger expenditures, vendor payouts, and secretary approval workflows.
- **`polls`**: Community democratic voting topics with defined expiration dates.
- **`poll_options`**: Selectable voting choices for each poll.
- **`poll_votes`**: Audited record ensuring each resident casts at most one vote per poll.
- **`notifications`**: Personalized user in-app and system alerts.
- **`support_tickets`**: Cross-organization support desk tickets raised by society secretaries to Super Admins.
- **`support_ticket_messages`**: Threaded conversations on support tickets.
- **`audit_logs`**: Platform security audit trail tracking critical administrative actions.

---

## 🚀 Migration Strategy (Flyway)

Database schema migrations are version-controlled under `backend/src/main/resources/db/migration/`:

```
backend/src/main/resources/db/migration/
├── V1__create_core_multi_society_and_identity_schema.sql
├── V2__create_operations_and_facilities_schema.sql
├── V3__create_communications_governance_and_support_schema.sql
└── V4__seed_initial_master_data.sql
```

### Key Principles:
1. **Migrations Are Immutable**: Never edit a migration file that has already been executed on a teammate's machine. Create a new `V5__...` migration instead.
2. **Automatic Execution**: When the Spring Boot backend boots up, Flyway executes any pending migrations automatically.
3. **Hibernate Schema Validation (`ddl-auto=validate`)**: Hibernate never modifies or drops tables directly. It strictly verifies that Java `@Entity` mappings align with Flyway's schema.

---

## 💻 Local Setup Instructions for Team Members

Follow these steps to set up the database on your computer (Windows, macOS, or Linux).

### 1. Prerequisites
- **MySQL Server 8.0+** installed and running on default port `3306`.
- **JDK 17+** (JDK 17, 21, or 25 are supported).

### 2. Verify MySQL Service
Ensure MySQL is running on your machine:
- **Windows (PowerShell)**:
  ```powershell
  Get-Service MySQL80
  # If stopped:
  Start-Service MySQL80
  ```
- **macOS / Linux**:
  ```bash
  sudo systemctl status mysql
  # or Homebrew on macOS:
  brew services list
  ```

### 3. Configure Database Credentials
You do **not** need to create the database manually. MySQL Connector/J's `createDatabaseIfNotExist=true` parameter creates the `societysync` database automatically upon connection.

Set your MySQL password using one of the two options below:

#### Option A: Using Environment Variables (Recommended)
Set `DB_PASSWORD` in your terminal session or your IDE run configuration:
- **Windows PowerShell**:
  ```powershell
  $env:DB_PASSWORD="your_mysql_password"
  ```
- **Windows Command Prompt (CMD)**:
  ```cmd
  set DB_PASSWORD=your_mysql_password
  ```
- **macOS / Linux (Bash/Zsh)**:
  ```bash
  export DB_PASSWORD="your_mysql_password"
  ```

#### Option B: Using `application-local.properties` (Ignored by Git)
1. Copy `backend/src/main/resources/application-local.properties.example` to `backend/src/main/resources/application-local.properties`:
   ```bash
   cp backend/src/main/resources/application-local.properties.example backend/src/main/resources/application-local.properties
   ```
2. Enter your local MySQL password in `application-local.properties`.

### 4. Build and Run the Backend
Navigate to the `backend/` directory and run using the Maven Wrapper:
- **Windows**:
  ```cmd
  cd backend
  mvnw.cmd spring-boot:run
  ```
- **macOS / Linux**:
  ```bash
  cd backend
  ./mvnw spring-boot:run
  ```

On startup, Flyway will:
1. Create database `societysync` if it does not already exist.
2. Run migrations `V1`, `V2`, `V3`, and `V4`.
3. Seed the sample society (`Greenwood Heights`), buildings, flats, users, and roles.
4. Hibernate validates all JPA entities against the schema.
5. The API will listen on `http://localhost:8080/api`.

---

## 🔧 Useful Database Commands

Check migration status and table count via MySQL CLI:
```bash
mysql -u root -p -e "USE societysync; SHOW TABLES;"
mysql -u root -p -e "USE societysync; SELECT version, description, success FROM flyway_schema_history;"
mysql -u root -p -e "USE societysync; SELECT id, code, name, city FROM societies;"
```
