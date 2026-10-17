# SocietySync — Frontend

The Angular-based frontend application for **SocietySync**.

## Tech Stack

- **Framework:** Angular (latest stable)
- **Language:** TypeScript
- **Styling:** SCSS
- **Build Tool:** Angular CLI / npm

## Directory Structure

```
frontend/
└── src/
    ├── app/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Route-level page components
    │   ├── services/         # Angular services (API communication)
    │   ├── models/           # TypeScript interfaces and type definitions
    │   ├── guards/           # Route guards (authentication, role-based access)
    │   ├── interceptors/     # HTTP interceptors (JWT token, error handling)
    │   ├── pipes/            # Custom Angular pipes
    │   ├── directives/       # Custom Angular directives
    │   └── shared/           # Shared modules, utilities, and constants
    ├── assets/
    │   ├── images/           # Static image files
    │   └── icons/            # Icon assets (SVG, PNG)
    └── environments/         # Environment-specific configurations
```

## Getting Started

> Setup instructions will be added once the Angular project is initialized with `ng new`.

### Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI (`npm install -g @angular/cli`)

### Development Server

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200/`.
