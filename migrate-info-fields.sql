-- Migration: fineart table + domain-specific fields for economics, geography, literature
-- Run once: psql -U heritage_user -d heritage_db -f migrate-info-fields.sql
-- (If you already ran update.sql, fineart exists; ALTER TABLEs are safe to run once.)

-- 1. Ensure fineart table exists (for Quản lý mỹ thuật)
CREATE TABLE IF NOT EXISTS fineart (
    id SERIAL PRIMARY KEY,
    fineart_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Economics: sector, figures, source
ALTER TABLE economics ADD COLUMN IF NOT EXISTS sector VARCHAR(255);
ALTER TABLE economics ADD COLUMN IF NOT EXISTS figures TEXT;
ALTER TABLE economics ADD COLUMN IF NOT EXISTS source VARCHAR(500);

-- 3. Geography: region, area, terrain
ALTER TABLE geography ADD COLUMN IF NOT EXISTS region VARCHAR(255);
ALTER TABLE geography ADD COLUMN IF NOT EXISTS area VARCHAR(255);
ALTER TABLE geography ADD COLUMN IF NOT EXISTS terrain TEXT;

-- 4. Literature: author, genre, period
ALTER TABLE literature ADD COLUMN IF NOT EXISTS author VARCHAR(255);
ALTER TABLE literature ADD COLUMN IF NOT EXISTS genre VARCHAR(255);
ALTER TABLE literature ADD COLUMN IF NOT EXISTS period VARCHAR(255);
