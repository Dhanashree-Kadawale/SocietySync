-- ==============================================================================
-- SocietySync Database Migration
-- Version: V1
-- Description: Core Multi-Housing Society, Roles, Users, Units & People Schema
-- ==============================================================================

-- 1. Societies (Multi-tenant Root Organization)
CREATE TABLE IF NOT EXISTS societies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    postal_code VARCHAR(20),
    total_units INT NOT NULL DEFAULT 0,
    total_towers INT NOT NULL DEFAULT 1,
    admin_name VARCHAR(100),
    admin_email VARCHAR(150),
    admin_phone VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    monthly_dues_volume VARCHAR(50),
    onboarded_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_societies_status (status),
    INDEX idx_societies_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Society Verification Requests (Super Admin Onboarding Workflow)
CREATE TABLE IF NOT EXISTS society_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT,
    society_name VARCHAR(150) NOT NULL,
    secretary_name VARCHAR(100) NOT NULL,
    secretary_email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    total_units INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'UNDER_REVIEW',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_verifications_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE SET NULL,
    INDEX idx_verifications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Roles
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Users (Multi-tenant User Accounts)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    avatar_url VARCHAR(255),
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE SET NULL,
    INDEX idx_users_society (society_id),
    INDEX idx_users_status (status),
    INDEX idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Roles (Many-to-Many Join Table)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Buildings / Wings / Towers
CREATE TABLE IF NOT EXISTS buildings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    total_floors INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_buildings_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    UNIQUE KEY uq_building_society_name (society_id, name),
    INDEX idx_buildings_society (society_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Flats / Units
CREATE TABLE IF NOT EXISTS flats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    building_id BIGINT NOT NULL,
    flat_number VARCHAR(50) NOT NULL,
    floor_number INT NOT NULL DEFAULT 1,
    bhk_type VARCHAR(20) NOT NULL DEFAULT '2BHK',
    carpet_area_sqft DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    parking_slot VARCHAR(50),
    intercom_number VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'VACANT',
    owner_name VARCHAR(100),
    owner_phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_flats_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_flats_building FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE,
    UNIQUE KEY uq_flats_building_number (building_id, flat_number),
    INDEX idx_flats_society (society_id),
    INDEX idx_flats_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Residents (Society Resident Profiles)
CREATE TABLE IF NOT EXISTS residents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    flat_id BIGINT,
    user_id BIGINT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    type VARCHAR(20) NOT NULL DEFAULT 'OWNER',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    join_date DATE,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_residents_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_residents_flat FOREIGN KEY (flat_id) REFERENCES flats (id) ON DELETE SET NULL,
    CONSTRAINT fk_residents_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_residents_society (society_id),
    INDEX idx_residents_flat (flat_id),
    INDEX idx_residents_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Staff Members (Maintenance & Security Personnel)
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    user_id BIGINT,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_staff_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_staff_society (society_id),
    INDEX idx_staff_status (status),
    INDEX idx_staff_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
