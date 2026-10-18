-- ==============================================================================
-- SocietySync Database Migration
-- Version: V5
-- Description: Add Society Admin and Security Guard roles & update demo user BCrypt hashes
-- ==============================================================================

-- 1. Insert new required roles
INSERT IGNORE INTO roles (name, description) VALUES
('ROLE_SOCIETY_ADMIN', 'Society Secretary / Managing Committee Administrator'),
('ROLE_SECURITY_GUARD', 'Gatekeeper and security guard personnel');

-- 2. Update demo users with authentic BCrypt hashes for login authentication
-- Super Admin (SuperAdmin@2026)
UPDATE users SET password_hash = '$2a$10$VSFmIRWZ9rYZtv2OarFtIe2IYahKt.hzpkKQwVol/ox8t8uLg/6Je' WHERE email = 'superadmin@societysync.com';

-- Secretary Admin (Secretary@2026)
UPDATE users SET password_hash = '$2a$10$bkO7h6G0xCxg8DlaK7EAaOfnt5elfd5q/Y0vVfnmj2LGbSTqT60mO' WHERE email = 'secretary@greenwood.com';

-- Resident Priya Sharma (Resident@2026)
UPDATE users SET password_hash = '$2a$10$vOlz49GcIRPxq6YIA8fVSuLjSiraMQipjuUqC/GeabC6VxFbfLNz2' WHERE email = 'priya.sharma@greenwood.com';

-- Resident Rahul Patil (Resident@2026)
UPDATE users SET password_hash = '$2a$10$vOlz49GcIRPxq6YIA8fVSuLjSiraMQipjuUqC/GeabC6VxFbfLNz2' WHERE email = 'rahul.patil@greenwood.com';

-- Staff Ramesh Shinde (Staff@2026)
UPDATE users SET password_hash = '$2a$10$PYyZdPJ.NFxb4nsQ672D4OtmVAtCQBFW229ACIIg0DZrQop2lgNFK' WHERE email = 'maintenance.lead@greenwood.com';

-- 3. Also assign ROLE_SOCIETY_ADMIN to Secretary Rajesh Mehta (user_id = 2)
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT 2, id FROM roles WHERE name = 'ROLE_SOCIETY_ADMIN';
