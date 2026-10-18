# SocietySync — Backend API

The Spring Boot-based backend API for **SocietySync**, built with Java 17+, Maven, Spring Data JPA, Flyway migrations, and MySQL 8+.

---

## 🛠️ Tech Stack

- **Framework:** Spring Boot 3.3.5
- **Language:** Java 17+ (tested on Java 17, 21, and 25 LTS)
- **Database:** MySQL 8+
- **Persistence:** Spring Data JPA / Hibernate 6 (`ddl-auto=validate`)
- **Schema Migrations:** Flyway (`flyway-core`, `flyway-mysql`)
- **Build Tool:** Maven 3.9+ (includes self-contained Maven Wrapper `mvnw` / `mvnw.cmd`)

---

## 📁 Directory Structure

```
backend/
├── .mvn/wrapper/                  # Maven wrapper binaries and configuration
├── mvnw                           # Linux / macOS Maven wrapper script
├── mvnw.cmd                       # Windows Maven wrapper script
├── pom.xml                        # Maven dependencies & build plugins
├── .env.example                   # Template for environment variables
├── src/
│   ├── main/
│   │   ├── java/com/societysync/
│   │   │   ├── SocietySyncApplication.java # Spring Boot entry point
│   │   │   ├── entity/           # JPA entity classes (24 validated tables)
│   │   │   ├── repository/       # Spring Data JPA repositories
│   │   │   ├── controller/       # REST API endpoint handlers
│   │   │   ├── service/          # Business logic interfaces
│   │   │   │   └── impl/         # Service layer implementations
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── config/           # App and bean configuration
│   │   │   ├── security/         # Security filters & JWT
│   │   │   ├── exception/        # Global exception handling
│   │   │   └── util/             # Utility classes
│   │   └── resources/
│   │       ├── application.properties               # Base config (ddl-auto=validate)
│   │       ├── application-local.properties.example # Local credentials template
│   │       └── db/migration/                        # Flyway versioned SQL scripts
│   │           ├── V1__create_core_multi_society_and_identity_schema.sql
│   │           ├── V2__create_operations_and_facilities_schema.sql
│   │           ├── V3__create_communications_governance_and_support_schema.sql
│   │           └── V4__seed_initial_master_data.sql
│   └── test/java/com/societysync/ # Integration & unit tests
└── README.md
```

---

## 🚀 Quick Start for Team Members

Follow these exact steps to run the backend on your computer.

### Step 1: Ensure MySQL is Running
- Default port: `3306`
- The application will automatically create the `societysync` database if it doesn't already exist via `createDatabaseIfNotExist=true`.

### Step 2: Set Your Database Password

#### Windows PowerShell:
```powershell
$env:DB_PASSWORD="your_mysql_password"
```

#### Windows Command Prompt (CMD):
```cmd
set DB_PASSWORD=your_mysql_password
```

#### macOS / Linux:
```bash
export DB_PASSWORD="your_mysql_password"
```

*(Alternatively, copy `src/main/resources/application-local.properties.example` to `src/main/resources/application-local.properties` and enter your password there. It is already ignored by git.)*

### Step 3: Run the Application

#### Windows:
```cmd
cd backend
mvnw.cmd spring-boot:run
```

#### macOS / Linux:
```bash
cd backend
./mvnw spring-boot:run
```

### Step 4: Verify the Backend is Running
- The server will start at: `http://localhost:8080/api`
- Check Flyway migration logs in the console to verify all 5 migration scripts executed successfully.

---

## 🧪 Build and Test Commands

```bash
# Clean and compile
./mvnw clean compile    # or mvnw.cmd clean compile on Windows

# Run all tests (including Auth & User management integration tests)
./mvnw test             # or mvnw.cmd test on Windows

# Package production JAR
./mvnw clean package -DskipTests
```

---

## 🔐 Authentication & User Management Module

The backend uses **Spring Security 6** with **JSON Web Tokens (JWT)** and **BCrypt** password hashing (strength 12) for stateless authentication and multi-housing society authorization.

### Default Demo Credentials for Teammates

All passwords are pre-hashed with BCrypt in Flyway migration `V5`:

| Role | Email | Password | Society |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `superadmin@societysync.com` | `SuperAdmin@2026` | Platform-wide |
| **SOCIETY_ADMIN** / **SECRETARY** | `secretary@greenwood.com` | `Secretary@2026` | Greenwood Heights (ID: 1) |
| **RESIDENT** | `priya.sharma@greenwood.com` | `Resident@2026` | Greenwood Heights (ID: 1) |
| **RESIDENT** | `rahul.patil@greenwood.com` | `Resident@2026` | Greenwood Heights (ID: 1) |
| **MAINTENANCE_STAFF** | `maintenance.lead@greenwood.com` | `Staff@2026` | Greenwood Heights (ID: 1) |

---

### Environment Variables

| Variable | Description | Default Value | Required in Production |
| :--- | :--- | :--- | :--- |
| `DB_HOST` | MySQL hostname | `localhost` | No |
| `DB_PORT` | MySQL port | `3306` | No |
| `DB_NAME` | MySQL database name | `societysync` | No |
| `DB_USERNAME` | MySQL user | `root` | No |
| `DB_PASSWORD` | MySQL password | `""` (empty) | **Yes** |
| `JWT_SECRET` | 256-bit+ HMAC-SHA secret key | Built-in development key | **Yes** |
| `JWT_EXPIRATION_MS`| JWT token expiration in ms | `86400000` (24 hours) | No |

---

### REST API Endpoints

#### 1. Login
- **URL:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "secretary@greenwood.com",
  "password": "Secretary@2026"
}
```
- **Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresInMs": 86400000,
  "user": {
    "id": 2,
    "name": "Rajesh Mehta",
    "email": "secretary@greenwood.com",
    "phone": "+91 98200 12345",
    "status": "ACTIVE",
    "societyId": 1,
    "societyName": "Greenwood Heights Co-op Society",
    "roles": ["ROLE_SOCIETY_ADMIN"],
    "createdAt": "2026-10-18T10:00:00"
  }
}
```

#### 2. Get Authenticated Profile
- **URL:** `GET /api/auth/me`
- **Access:** Authenticated (`Bearer <token>`)
- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:** Returns the safe `UserResponseDto` (password hash is never exposed).

#### 3. Register Resident
- **URL:** `POST /api/auth/register/resident`
- **Access:** Public
- **Request Body:**
```json
{
  "fullName": "Amit Verma",
  "email": "amit.verma@example.com",
  "phone": "+91 98765 43210",
  "password": "StrongPassword@2026",
  "societyId": 1,
  "wing": "Tower A",
  "flatNumber": "A-304",
  "residentType": "Flat Owner"
}
```
- **Response `201 Created`:** Safe `UserResponseDto` with role `ROLE_RESIDENT`.

#### 4. Register Staff / Guard
- **URL:** `POST /api/auth/register/staff`
- **Access:** Public (account created in `PENDING` status awaiting society admin approval)
- **Request Body:**
```json
{
  "fullName": "Ramesh Shinde",
  "email": "ramesh.shinde@example.com",
  "phone": "+91 98111 22233",
  "password": "StaffPassword@2026",
  "societyId": 1,
  "staffRole": "SECURITY_GUARD",
  "department": "Security",
  "shiftTimings": "Night (8 PM - 8 AM)",
  "agencyName": "Apex Security Services"
}
```
- **Response `201 Created`:** Safe `UserResponseDto` with status `PENDING`.

#### 5. Register Society & Secretary Onboarding
- **URL:** `POST /api/auth/register/secretary`
- **Access:** Public (creates society and admin in `PENDING` status with `SocietyVerification` set to `UNDER_REVIEW`)
- **Request Body:**
```json
{
  "secretaryName": "Suresh Kale",
  "email": "suresh.kale@newheights.com",
  "phone": "+91 98222 33344",
  "password": "AdminPassword@2026",
  "societyName": "New Heights Society",
  "registrationNumber": "MH/PUN/2026/999",
  "address": "12 Baner Road",
  "city": "Pune",
  "state": "Maharashtra",
  "pincode": "411045",
  "totalWings": 3,
  "totalFlats": 120
}
```
- **Response `201 Created`:** User created with `ROLE_SOCIETY_ADMIN` and `PENDING` status, preventing unauthorized administrative access until verified.

#### 6. User Management Endpoints
- `GET /api/users/{id}` — Get user by ID (Self, Society Admin of same society, or Super Admin).
- `PUT /api/users/{id}` — Update user name / phone / avatar.
- `GET /api/users/society/{societyId}` — List all users in a society (enforces society isolation; returns 403 if accessed across societies).
- `PATCH /api/users/{id}/status` — Update user status (`ACTIVE`, `PENDING`, `SUSPENDED`). Restricted to `SUPER_ADMIN` and `SOCIETY_ADMIN`.

---

### Multi-Society Security & Data Isolation

1. **Strict Role Hierarchy:**
   - `ROLE_SUPER_ADMIN`: Cross-society platform management.
   - `ROLE_SOCIETY_ADMIN`: Can manage users and settings within their own housing society only.
   - `ROLE_RESIDENT`, `ROLE_SECURITY_GUARD`, `ROLE_MAINTENANCE_STAFF`: Limited to self profile and allowed resident/operations endpoints.
2. **Public Registration Guard:** Public registration requests can never assign `ROLE_SUPER_ADMIN` or activate an unverified `ROLE_SOCIETY_ADMIN`.
3. **Tenant Boundary Enforcement:** Society administrators and users attempting to query or update users of a different `society_id` are blocked with `403 Forbidden`.
4. **CORS Configuration:** Restricts browser origins to Angular frontend (`http://localhost:4200`, `http://localhost:4201`, `http://127.0.0.1:4200`) with credential support.

