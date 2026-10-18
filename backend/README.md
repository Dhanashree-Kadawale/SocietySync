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
- Check Flyway migration logs in the console to verify all 4 migration scripts executed successfully.

---

## 🧪 Build and Test Commands

```bash
# Clean and compile
./mvnw clean compile    # or mvnw.cmd clean compile on Windows

# Run tests
./mvnw test             # or mvnw.cmd test on Windows

# Package production JAR
./mvnw clean package -DskipTests
```
