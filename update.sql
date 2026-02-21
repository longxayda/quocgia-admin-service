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

-- Music audio file per heritage (file âm thanh âm nhạc tại mục di sản)
ALTER TABLE heritages
ADD COLUMN IF NOT EXISTS music_audio_url VARCHAR(500);

-- Map places (địa điểm bản đồ: tên, địa chỉ, toạ độ, thuyết minh, ảnh 360 hoặc phẳng)
CREATE TABLE IF NOT EXISTS map_places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  coordinates REAL[], -- [lng, lat]
  narration_audio_url VARCHAR(500),
  media_type VARCHAR(20) DEFAULT 'flat' CHECK (media_type IN ('360', 'flat')),
  media_url VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
