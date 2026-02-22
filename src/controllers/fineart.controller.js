// src/controllers/fineart.controller.js
const fineArtService = require('../services/fineart.service');

const fineArtController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await fineArtService.getAll(+page, +limit);
      res.json(result);
    } catch (error) {
      console.error('GetAll error:', error);
      res.status(500).json({ message: error.message, error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const result = await fineArtService.getById(req.params.id);
      
      if (!result) {
        return res.status(404).json({ message: 'Fine art not found', error: 'Fine art not found' });
      }
      
      res.json(result);
    } catch (error) {
      console.error('GetById error:', error);
      res.status(500).json({ message: error.message, error: error.message });
    }
  }
};

module.exports = fineArtController;