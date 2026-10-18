-- ==============================================================================
-- SocietySync Database Migration
-- Version: V4
-- Description: Seed Initial System Roles, Reference Societies, Users & Operations Data
-- ==============================================================================

-- 1. System Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_SUPER_ADMIN', 'Platform Administrator with multi-society master access'),
(2, 'ROLE_SECRETARY_ADMIN', 'Society Secretary / Managing Committee Administrator'),
(3, 'ROLE_RESIDENT', 'Flat Owner or Tenant resident member'),
(4, 'ROLE_MAINTENANCE_STAFF', 'Facility maintenance, security, and operations personnel')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Multi-Housing Societies (Matching UI Records)
INSERT INTO societies (id, code, name, registration_number, location, city, state, total_units, total_towers, admin_name, admin_email, admin_phone, status, subscription_plan, monthly_dues_volume, onboarded_date) VALUES
(1, 'SOC-1041', 'Greenwood Heights Co-op Society', 'MAH/PUN/2021/8941', 'Baner, Pune, MH', 'Pune', 'Maharashtra', 120, 3, 'Rajesh Mehta', 'secretary@greenwood.com', '+91 98765 88990', 'ACTIVE', 'ENTERPRISE', '₹6,24,000', '2024-01-12'),
(2, 'SOC-1088', 'Palm Meadows Residential Township', 'MAH/PUN/2022/4102', 'Kalyani Nagar, Pune, MH', 'Pune', 'Maharashtra', 340, 6, 'Sunil Deshmukh', 'sunil.deshmukh@palmmeadows.org', '+91 98765 44102', 'ACTIVE', 'ENTERPRISE', '₹18,40,000', '2024-03-04'),
(3, 'SOC-1105', 'Silver Oak Luxury Residency', 'MAH/MUM/2023/1109', 'Powai, Mumbai, MH', 'Mumbai', 'Maharashtra', 84, 2, 'Vikram Merchant', 'admin@silveroakpowai.com', '+91 98200 77119', 'ACTIVE', 'PROFESSIONAL', '₹5,12,000', '2024-08-19')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Users (Initial Accounts)
-- Default bcrypt hashes provided for local dev ($2a$10$e.g. standard mock password hash)
INSERT INTO users (id, society_id, name, email, phone, password_hash, status, two_factor_enabled) VALUES
(1, NULL, 'Dhanashree Kadawale', 'superadmin@societysync.com', '+91 98765 00001', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr', 'ACTIVE', TRUE),
(2, 1, 'Rajesh Mehta', 'secretary@greenwood.com', '+91 98765 88990', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr', 'ACTIVE', FALSE),
(3, 1, 'Priya Sharma', 'priya.sharma@greenwood.com', '+91 98765 43210', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr', 'ACTIVE', FALSE),
(4, 1, 'Rahul Patil', 'rahul.patil@greenwood.com', '+91 98765 12340', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr', 'ACTIVE', FALSE),
(5, 1, 'Ramesh Shinde', 'maintenance.lead@greenwood.com', '+91 98765 77112', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr', 'ACTIVE', FALSE)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 4. User Role Mapping
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Super Admin
(2, 2), -- Secretary Admin
(3, 3), -- Resident
(4, 3), -- Resident
(5, 4)  -- Maintenance Staff
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- 5. Buildings / Wings for Greenwood Heights
INSERT INTO buildings (id, society_id, name, total_floors) VALUES
(1, 1, 'Wing A', 10),
(2, 1, 'Wing B', 10),
(3, 1, 'Wing C', 10)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 6. Flats in Greenwood Heights
INSERT INTO flats (id, society_id, building_id, flat_number, floor_number, bhk_type, carpet_area_sqft, parking_slot, intercom_number, status, owner_name, owner_phone) VALUES
(1, 1, 1, 'A-101', 1, '2BHK', 950.00, 'P-A101', '101', 'OCCUPIED', 'Amit Kulkarni', '+91 98765 11111'),
(2, 1, 1, 'A-204', 2, '3BHK', 1250.00, 'P-A204', '204', 'OCCUPIED', 'Priya Sharma', '+91 98765 43210'),
(3, 1, 2, 'B-105', 1, '2BHK', 980.00, 'P-B105', '305', 'OCCUPIED', 'Rahul Patil', '+91 98765 12340'),
(4, 1, 3, 'C-302', 3, '1BHK', 620.00, 'P-C302', '502', 'VACANT', NULL, NULL)
ON DUPLICATE KEY UPDATE flat_number=VALUES(flat_number);

-- 7. Residents
INSERT INTO residents (id, society_id, flat_id, user_id, name, email, phone, type, status, join_date) VALUES
(1, 1, 2, 3, 'Priya Sharma', 'priya.sharma@greenwood.com', '+91 98765 43210', 'OWNER', 'ACTIVE', '2024-01-15'),
(2, 1, 3, 4, 'Rahul Patil', 'rahul.patil@greenwood.com', '+91 98765 12340', 'OWNER', 'ACTIVE', '2024-02-22')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 8. Staff Members
INSERT INTO staff (id, society_id, user_id, name, role, department, phone, email, status) VALUES
(1, 1, 5, 'Ramesh Shinde', 'Lead Electrician', 'Electrical & Lift', '+91 98765 77112', 'maintenance.lead@greenwood.com', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 9. Facilities in Greenwood Heights
INSERT INTO facilities (id, society_id, name, description, capacity, price_per_hour, status, amenities) VALUES
(1, 1, 'Community Clubhouse', 'Air-conditioned hall suitable for celebrations, meetings, and parties.', 80, 500.00, 'AVAILABLE', 'Projector,Sound System,AC,Chairs'),
(2, 1, 'Swimming Pool', 'Semi-Olympic 25m swimming pool with separate kids splash deck.', 30, 0.00, 'AVAILABLE', 'Showers,Lockers,Lifeguard'),
(3, 1, 'Tennis Court', 'Synthetic turf court with LED floodlights.', 4, 150.00, 'AVAILABLE', 'Floodlights,Nets')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 10. Sample Complaints
INSERT INTO complaints (id, society_id, flat_id, resident_id, assigned_staff_id, title, description, category, priority, status) VALUES
(1, 1, 2, 1, 1, 'Water Seepage in Balcony Ceiling', 'Heavy rainwater dripping through exterior wall junction in master balcony.', 'CIVIL', 'HIGH', 'IN_PROGRESS'),
(2, 1, 3, 2, 1, 'Corridor Lighting Flickering near B-105', 'Main hallway LED panel intermittent flickering during evening hours.', 'ELECTRICAL', 'MEDIUM', 'OPEN')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 11. Sample Maintenance Bills
INSERT INTO maintenance_bills (id, society_id, flat_id, resident_id, bill_number, billing_month, billing_year, base_amount, sinking_fund, water_charges, parking_charges, penalty_amount, total_amount, status, due_date, issued_date) VALUES
(1, 1, 2, 1, 'BILL-2026-10-A204', 'October', 2026, 4200.00, 500.00, 300.00, 200.00, 0.00, 5200.00, 'PAID', '2026-10-25', '2026-10-01'),
(2, 1, 3, 2, 'BILL-2026-10-B105', 'October', 2026, 3800.00, 500.00, 300.00, 200.00, 0.00, 4800.00, 'UNPAID', '2026-10-25', '2026-10-01')
ON DUPLICATE KEY UPDATE bill_number=VALUES(bill_number);

-- 12. Sample Notices
INSERT INTO notices (id, society_id, author_id, title, content, category, priority, is_pinned) VALUES
(1, 1, 2, 'Diwali Festival Community Gathering & Cultural Night', 'Annual Diwali celebration on the clubhouse lawn this Saturday starting at 6:30 PM. All residents and families are warmly invited.', 'CELEBRATION', 'NORMAL', TRUE),
(2, 1, 2, 'Scheduled Overhead Water Tank Cleaning & Sanitization', 'Water supply will be suspended between 10:00 AM and 02:00 PM this Thursday for routine chlorination and tank maintenance.', 'MAINTENANCE', 'HIGH', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);
