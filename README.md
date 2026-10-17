# SocietySync

A full-stack smart housing society management system built with **Angular**, **Spring Boot**, **Spring Security**, **JWT**, and **MySQL**.

---

## 📁 Project Structure

```
SocietySync/
├── backend/                          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/societysync/
│   │   │   │   ├── controller/       # REST API controllers
│   │   │   │   ├── service/          # Business logic interfaces
│   │   │   │   │   └── impl/         # Service implementations
│   │   │   │   ├── repository/       # JPA repositories
│   │   │   │   ├── entity/           # JPA entity classes
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── config/           # App & bean configuration
│   │   │   │   ├── security/         # Spring Security & JWT
│   │   │   │   ├── exception/        # Custom exception handlers
│   │   │   │   └── util/             # Utility/helper classes
│   │   │   └── resources/            # application.properties, etc.
│   │   └── test/java/com/societysync/ # Unit & integration tests
│   └── .gitignore
│
├── frontend/                         # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/           # Reusable UI components
│   │   │   ├── pages/                # Route-level page components
│   │   │   ├── services/             # Angular services (API calls)
│   │   │   ├── models/               # TypeScript interfaces/models
│   │   │   ├── guards/               # Route guards (auth, role)
│   │   │   ├── interceptors/         # HTTP interceptors (JWT, errors)
│   │   │   ├── pipes/                # Custom Angular pipes
│   │   │   ├── directives/           # Custom Angular directives
│   │   │   └── shared/               # Shared modules & utilities
│   │   ├── assets/
│   │   │   ├── images/               # Static images
│   │   │   └── icons/                # Icon assets
│   │   └── environments/             # Environment configurations
│   └── .gitignore
│
├── docs/                             # Project documentation
├── .gitignore                        # Root-level git ignores
└── README.md                         # This file
```

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Angular, TypeScript, HTML, SCSS   |
| Backend    | Spring Boot, Spring Security, JWT |
| Database   | MySQL                             |
| Build      | Maven (backend), npm (frontend)   |

## 🚀 Getting Started

> Detailed setup instructions will be added as features are implemented.

### Prerequisites

- **Java** 17+
- **Node.js** 18+ & npm
- **Angular CLI**
- **MySQL** 8+
- **Maven** 3.8+

## 👥 Branch Strategy

| Branch     | Purpose                              |
|------------|--------------------------------------|
| `main`     | Production-ready code                |
| `develop`  | Integration branch for team work     |
| `feature/*`| Individual feature branches          |
| `bugfix/*` | Bug fix branches                     |

Team members create feature branches off `develop` and merge back via pull requests.

## 📄 License

This project is for educational / internal use.
