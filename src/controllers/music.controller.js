// src/controllers/music.controller.js
const musicService = require('../services/music.service');

const musicController = {
  // Danh sách theo ngôn ngữ
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await musicService.getAll(+page, +limit);
      res.json(result);
    } catch (error) {
      console.error('GetAll error:', error);
      res.status(500).json({ message: error.message, error: error.message });
    }
  },

  // Chi tiết theo ngôn ngữ
  async getById(req, res) {
    try {
      const result = await musicService.getById(req.params.id);
      
      if (!result) {
        return res.status(404).json({ message: 'Music not found', error: 'Music not found' });
      }
      
      res.json(result);
    } catch (error) {
      console.error('GetById error:', error);
      res.status(500).json({ message: error.message, error: error.message });
    }
  }
};

module.exports = musicController;