-- Add role, status, and phone columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR;
