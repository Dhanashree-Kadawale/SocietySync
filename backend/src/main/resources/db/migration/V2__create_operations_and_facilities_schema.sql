-- ==============================================================================
-- SocietySync Database Migration
-- Version: V2
-- Description: Complaints, Maintenance Bills, Payments, Facilities, Bookings, Visitors
-- ==============================================================================

-- 1. Complaints (Resident Helpdesk & Maintenance Issues)
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    flat_id BIGINT,
    resident_id BIGINT,
    assigned_staff_id BIGINT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    resolution_notes TEXT,
    resolved_at DATETIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaints_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_complaints_flat FOREIGN KEY (flat_id) REFERENCES flats (id) ON DELETE SET NULL,
    CONSTRAINT fk_complaints_resident FOREIGN KEY (resident_id) REFERENCES residents (id) ON DELETE SET NULL,
    CONSTRAINT fk_complaints_staff FOREIGN KEY (assigned_staff_id) REFERENCES staff (id) ON DELETE SET NULL,
    INDEX idx_complaints_society (society_id),
    INDEX idx_complaints_status (status),
    INDEX idx_complaints_priority (priority),
    INDEX idx_complaints_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Maintenance Bills (Monthly / Quarterly Invoices)
CREATE TABLE IF NOT EXISTS maintenance_bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    flat_id BIGINT NOT NULL,
    resident_id BIGINT,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    billing_month VARCHAR(20) NOT NULL,
    billing_year INT NOT NULL,
    base_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    sinking_fund DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    water_charges DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    parking_charges DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    penalty_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    due_date DATE NOT NULL,
    issued_date DATE NOT NULL,
    paid_date DATE,
    payment_mode VARCHAR(50),
    receipt_number VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bills_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_bills_flat FOREIGN KEY (flat_id) REFERENCES flats (id) ON DELETE CASCADE,
    CONSTRAINT fk_bills_resident FOREIGN KEY (resident_id) REFERENCES residents (id) ON DELETE SET NULL,
    INDEX idx_bills_society (society_id),
    INDEX idx_bills_status (status),
    INDEX idx_bills_month_year (billing_year, billing_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Payments (Maintenance Dues & Facility Booking Receipts)
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    bill_id BIGINT,
    resident_id BIGINT,
    flat_id BIGINT,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_type VARCHAR(50) NOT NULL DEFAULT 'MAINTENANCE',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'UPI',
    transaction_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    receipt_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_bill FOREIGN KEY (bill_id) REFERENCES maintenance_bills (id) ON DELETE SET NULL,
    CONSTRAINT fk_payments_resident FOREIGN KEY (resident_id) REFERENCES residents (id) ON DELETE SET NULL,
    CONSTRAINT fk_payments_flat FOREIGN KEY (flat_id) REFERENCES flats (id) ON DELETE SET NULL,
    INDEX idx_payments_society (society_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Facilities / Amenities
CREATE TABLE IF NOT EXISTS facilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INT NOT NULL DEFAULT 10,
    price_per_hour DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    image_url VARCHAR(255),
    amenities TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_facilities_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    INDEX idx_facilities_society (society_id),
    INDEX idx_facilities_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Facility Bookings
CREATE TABLE IF NOT EXISTS facility_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    facility_id BIGINT NOT NULL,
    resident_id BIGINT NOT NULL,
    flat_id BIGINT,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    guests_count INT NOT NULL DEFAULT 1,
    booking_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL',
    purpose VARCHAR(255),
    special_requests TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_facility FOREIGN KEY (facility_id) REFERENCES facilities (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_resident FOREIGN KEY (resident_id) REFERENCES residents (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_flat FOREIGN KEY (flat_id) REFERENCES flats (id) ON DELETE SET NULL,
    INDEX idx_bookings_society (society_id),
    INDEX idx_bookings_date (booking_date),
    INDEX idx_bookings_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Visitors (Gate Management, Digital Passes & Visitor Log)
CREATE TABLE IF NOT EXISTS visitors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    flat_id BIGINT NOT NULL,
    host_resident_id BIGINT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    purpose VARCHAR(100) NOT NULL,
    vehicle_number VARCHAR(50),
    entry_pass_code VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'EXPECTED',
    check_in_time DATETIME,
    check_out_time DATETIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_visitors_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_visitors_flat FOREIGN KEY (flat_id) REFERENCES flats (id) ON DELETE CASCADE,
    CONSTRAINT fk_visitors_resident FOREIGN KEY (host_resident_id) REFERENCES residents (id) ON DELETE SET NULL,
    INDEX idx_visitors_society (society_id),
    INDEX idx_visitors_status (status),
    INDEX idx_visitors_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
