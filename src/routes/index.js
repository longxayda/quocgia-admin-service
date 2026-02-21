// src/routes/index.js
const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin.routes');
const heritageRoutes = require('./heritage.routes');
const musicRoutes = require('./music.routes')
const fineArtRoutes = require('./fineart.routes');
const mapPlaceController = require('../controllers/map-place.controller');
const { SUPPORTED_LANGUAGES, RANKING_TYPES } = require('../utils/constants');

// Admin routes
router.use('/admin', adminRoutes);

// Public routes
router.use('/heritages', heritageRoutes);

router.use('/music', musicRoutes);

router.use('/fineart', fineArtRoutes);

// Map places (public list for map page)
router.get('/map-places', mapPlaceController.getAllPublic);

// Get supported languages (same shape as other admin endpoints)
router.get('/languages', (req, res) => {
  res.json({ success: true, data: SUPPORTED_LANGUAGES });
});

// Get ranking types (single source of truth for heritage form dropdown)
router.get('/constants/ranking-types', (req, res) => {
  res.json({ success: true, data: RANKING_TYPES });
});

module.exports = router;