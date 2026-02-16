const express = require('express');
const router = express.Router();
const fineArtController = require('../controllers/fineart.controller');

// Public routes - Get by language
router.get('/', fineArtController.getAll);
router.get('/:id', fineArtController.getById);

module.exports = router;