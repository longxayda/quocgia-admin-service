// src/routes/music.routes.js
const express = require('express');
const router = express.Router();

const musicController = require('../controllers/music.controller');

// Public routes - Get by language
router.get('/', musicController.getAll);
router.get('/:id', musicController.getById);

module.exports = router;