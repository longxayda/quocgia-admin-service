// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middlewares/upload');
const adminController = require('../controllers/admin.controller');
const mapPlaceController = require('../controllers/map-place.controller');

// Middleware wrapper to handle multer errors nicely
const uploadFieldsMiddleware = (req, res, next) => {
  const uploader = upload.fields([
    { name: 'image', maxCount: 1 },      // Main cover image
    { name: 'audio', maxCount: 1 },      // Audio for original language
    { name: 'music_audio', maxCount: 1 }, // Audio âm nhạc (di sản)
    { name: 'gallery', maxCount: 20 },    // Gallery images (up to 20)
    { name: 'image360', maxCount: 1 },
    { name: 'fineart', maxCount: 20 },
  ]);

  uploader(req, res, function (err) {
    console.log(req.files)
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File vượt quá 50MB giới hạn.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Quá nhiều files hoặc tên field không đúng.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    next(); // ✅ continue to controller
  });
};

// Map places upload: mapplace_narration (audio), mapplace_image (image)
const mapPlaceUploadMiddleware = (req, res, next) => {
  const uploader = upload.fields([
    { name: 'mapplace_narration', maxCount: 1 },
    { name: 'mapplace_image', maxCount: 1 },
  ]);
  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File vượt quá 50MB giới hạn.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

//
// CRUD routes
//
router.post('/heritages', uploadFieldsMiddleware, adminController.create);
router.get('/heritages', adminController.getAll);
router.get('/heritages/:id', adminController.getById);
router.put('/heritages/:id', uploadFieldsMiddleware, adminController.update);
router.delete('/heritages/:id', adminController.delete);

//
// MUSIC ROUTES (YouTube link only)
//

router.post('/music', adminController.createMusic);
router.get('/music', adminController.getAllMusic);
router.get('/music/:id', adminController.getMusicById);
router.delete('/music/:id', adminController.deleteMusic);

//
// FINEART ROUTES (YouTube link only)
//

router.post('/fineart', uploadFieldsMiddleware, adminController.createFineArt);
router.get('/fineart', adminController.getAllFineArt);
router.get('/fineart/:id', adminController.getFineArtById);
router.delete('/fineart/:id', adminController.deleteFineArt);

//
// MAP PLACES (địa điểm bản đồ)
//
router.get('/map-places', mapPlaceController.getAll);
router.get('/map-places/:id', mapPlaceController.getById);
router.post('/map-places', mapPlaceUploadMiddleware, mapPlaceController.create);
router.put('/map-places/:id', mapPlaceUploadMiddleware, mapPlaceController.update);
router.delete('/map-places/:id', mapPlaceController.delete);

module.exports = router;