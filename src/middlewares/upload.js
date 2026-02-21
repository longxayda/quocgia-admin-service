// src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const audioDir = path.join(__dirname, '../../uploads/audio');
const imageDir = path.join(__dirname, '../../uploads/images');
const galleryDir = path.join(__dirname, '../../uploads/gallery');
const image360Dir = path.join(__dirname, '../../uploads/image360');
const fineArtDir = path.join(__dirname, '../../uploads/fineart');
const mapPlacesDir = path.join(__dirname, '../../uploads/mapplaces');

fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(galleryDir, { recursive: true });
fs.mkdirSync(image360Dir, { recursive: true });
fs.mkdirSync(fineArtDir, { recursive: true });
fs.mkdirSync(mapPlacesDir, { recursive: true });

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio' || file.fieldname === 'music_audio') {
      cb(null, audioDir);
    } else if (file.fieldname === 'image') {
      cb(null, imageDir);
    } else if (file.fieldname === 'gallery') {
      cb(null, galleryDir);
    } else if (file.fieldname === 'image360') {
      cb(null, image360Dir);
    } else if (file.fieldname === 'fineart') {
      cb(null, fineArtDir);
    } else if (file.fieldname === 'mapplace_image') {
      cb(null, mapPlacesDir);
    } else if (file.fieldname === 'mapplace_narration') {
      cb(null, audioDir);
    } else {
      cb(null, path.join(__dirname, '../../uploads'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio' || file.fieldname === 'music_audio') {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files allowed'), false);
    }
    // Allow audio up to 50MB (checked later by multer limit)
    cb(null, true);

  } else if (file.fieldname === 'image' || file.fieldname === 'gallery' || file.fieldname === 'fineart' || file.fieldname === 'mapplace_image') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
  } else if (file.fieldname === 'mapplace_narration') {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files allowed'), false);
    }
    cb(null, true);
  } else {
    cb(null, true);
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max (for audio)
});

module.exports = upload;