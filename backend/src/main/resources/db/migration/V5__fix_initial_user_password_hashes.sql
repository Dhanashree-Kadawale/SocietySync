-- ==============================================================================
-- SocietySync Database Migration
-- Version: V5
-- Description: Upgrade Seed User Password Hashes to Genuine BCrypt Format
-- ==============================================================================

UPDATE users 
SET password_hash = '$2a$10$1qt8/j9z.mrhJVZlfmt7POjTd010zCOTdXuvSeK09EFmFJ5b10Kj.' 
WHERE id = 1 OR email = 'superadmin@societysync.com';

UPDATE users 
SET password_hash = '$2a$10$qch4whBLcm3T7Kqxg122G.NrZWVqWPiv6gDAzRFx3x1O.uumvT/uq' 
WHERE id = 2 OR email = 'secretary@greenwood.com';

UPDATE users 
SET password_hash = '$2a$10$DPie5iwuHgxwF7PkEZ3VIOmtNtubVKTjNZKobVNYZP7JTxYiijpgW' 
WHERE id = 3 OR email = 'priya.sharma@greenwood.com';

UPDATE users 
SET password_hash = '$2a$10$DPie5iwuHgxwF7PkEZ3VIOmtNtubVKTjNZKobVNYZP7JTxYiijpgW' 
WHERE id = 4 OR email = 'rahul.patil@greenwood.com';

UPDATE users 
SET password_hash = '$2a$10$l/4PEp7RQk9QcxnngTf.n.CrllL6VZU2c/fUuDTAk0kebva7.Tn9q' 
WHERE id = 5 OR email = 'maintenance.lead@greenwood.com';

