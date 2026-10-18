-- ==============================================================================
-- SocietySync Database Migration
-- Version: V3
-- Description: Notices, Documents, Expenses, Polls, Notifications, Support & Audit
-- ==============================================================================

-- 1. Notices (Society Bulletin Board Announcements)
CREATE TABLE IF NOT EXISTS notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    author_id BIGINT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    posted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notices_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_notices_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_notices_society (society_id),
    INDEX idx_notices_pinned (is_pinned),
    INDEX idx_notices_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Society Documents (Bylaws, AGM Minutes, Financial Audits, NOC Forms)
CREATE TABLE IF NOT EXISTS society_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    uploaded_by_id BIGINT,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_documents_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_documents_uploader FOREIGN KEY (uploaded_by_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_documents_society (society_id),
    INDEX idx_documents_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Expenses (Society Expenditure & Vendor Management)
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    approved_by_id BIGINT,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    expense_date DATE NOT NULL,
    vendor_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    receipt_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expenses_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_expenses_approver FOREIGN KEY (approved_by_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_expenses_society (society_id),
    INDEX idx_expenses_status (status),
    INDEX idx_expenses_date (expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Polls (Resident Voting & Community Decisions)
CREATE TABLE IF NOT EXISTS polls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    created_by_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    end_date DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_polls_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_polls_creator FOREIGN KEY (created_by_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_polls_society (society_id),
    INDEX idx_polls_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Poll Options
CREATE TABLE IF NOT EXISTS poll_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    poll_id BIGINT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    vote_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_poll_options_poll FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE,
    INDEX idx_poll_options_poll (poll_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Poll Votes (Tracks Each Resident's Single Vote)
CREATE TABLE IF NOT EXISTS poll_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    poll_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    voted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_poll_votes_poll FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE,
    CONSTRAINT fk_poll_votes_option FOREIGN KEY (option_id) REFERENCES poll_options (id) ON DELETE CASCADE,
    CONSTRAINT fk_poll_votes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY uq_poll_user_vote (poll_id, user_id),
    INDEX idx_poll_votes_poll (poll_id),
    INDEX idx_poll_votes_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Notifications (User & Society Alerts)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_tab VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Support Tickets (Super Admin Helpdesk for Societies)
CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT NOT NULL,
    requester_id BIGINT,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tickets_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE CASCADE,
    CONSTRAINT fk_tickets_requester FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_tickets_society (society_id),
    INDEX idx_tickets_status (status),
    INDEX idx_tickets_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Support Ticket Messages (Thread Conversations)
CREATE TABLE IF NOT EXISTS support_ticket_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    sender_id BIGINT,
    sender_name VARCHAR(100) NOT NULL,
    message_text TEXT NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_messages_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_messages_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_ticket_messages_ticket (ticket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Audit Logs (Platform Security & Governance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    society_id BIGINT,
    actor_id BIGINT,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50),
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_society FOREIGN KEY (society_id) REFERENCES societies (id) ON DELETE SET NULL,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_audit_society (society_id),
    INDEX idx_audit_severity (severity),
    INDEX idx_audit_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
