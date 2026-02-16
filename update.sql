ALTER TABLE heritages
ADD COLUMN image360 VARCHAR(500);

ALTER TABLE heritages
ADD COLUMN coordinates REAL [];

ALTER TABLE heritages
ADD COLUMN category VARCHAR(50) DEFAULT 'di_san';

CREATE TABLE music (
  id SERIAL PRIMARY KEY,
  youtube_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fineart (
    id SERIAL PRIMARY KEY,
    fineart_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
