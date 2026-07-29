-- Email verifications table already exists in 001_initial.sql
-- This is just a placeholder for future email-related features

-- Add email notification preferences
ALTER TABLE users ADD COLUMN email_notifications JSONB DEFAULT '{"marketing":true,"order_updates":true,"promotions":true}';

-- Add last_verification_sent_at to prevent spamming
ALTER TABLE email_verifications ADD COLUMN last_sent_at TIMESTAMP DEFAULT NOW();
