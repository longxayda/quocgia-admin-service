-- Thông tin Kinh tế, Địa lý, Văn học (admin)
-- Chạy file này trên DB: psql -U heritage_user -d heritage_db -f init-info-tables.sql

CREATE TABLE IF NOT EXISTS economics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    sector VARCHAR(255),
    figures TEXT,
    source VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geography (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    region VARCHAR(255),
    area VARCHAR(255),
    terrain TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS literature (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    author VARCHAR(255),
    genre VARCHAR(255),
    period VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_economics_created_at ON economics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_geography_created_at ON geography(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_literature_created_at ON literature(created_at DESC);
