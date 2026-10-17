# SocietySync — Backend

The Spring Boot-based backend API for **SocietySync**.

## Tech Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Security:** Spring Security with JWT authentication
- **Database:** MySQL 8+ with Spring Data JPA
- **Build Tool:** Maven

## Directory Structure

```
backend/
└── src/
    ├── main/
    │   ├── java/com/societysync/
    │   │   ├── controller/       # REST API endpoint handlers
    │   │   ├── service/          # Business logic interfaces
    │   │   │   └── impl/         # Service layer implementations
    │   │   ├── repository/       # Spring Data JPA repositories
    │   │   ├── entity/           # JPA entity classes (database models)
    │   │   ├── dto/              # Data Transfer Objects (request/response)
    │   │   ├── config/           # Application and bean configuration
    │   │   ├── security/         # Security filters, JWT provider, config
    │   │   ├── exception/        # Global exception handlers and custom exceptions
    │   │   └── util/             # Utility and helper classes
    │   └── resources/            # application.properties, SQL scripts, etc.
    └── test/
        └── java/com/societysync/ # Unit and integration tests
```

## Getting Started

> Setup instructions will be added once the Spring Boot project is initialized with Spring Initializr.

### Prerequisites

- Java 17+ (JDK)
- Maven 3.8+
- MySQL 8+

### Running Locally

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/`.
