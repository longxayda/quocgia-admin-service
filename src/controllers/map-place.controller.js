// src/controllers/map-place.controller.js
const mapPlaceService = require('../services/map-place.service');

const mapPlaceController = {
  async getAllPublic(req, res) {
    try {
      const data = await mapPlaceService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      console.error('[MapPlace] getAllPublic error:', error);
      res.status(500).json({ success: false, message: error.message, error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const data = await mapPlaceService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      console.error('[MapPlace] getAll error:', error);
      res.status(500).json({ success: false, message: error.message, error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const result = await mapPlaceService.getById(req.params.id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Map place not found', error: 'Map place not found' });
      }
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('[MapPlace] getById error:', error);
      res.status(500).json({ success: false, message: error.message, error: error.message });
    }
  },

  async create(req, res) {
    try {
      const result = await mapPlaceService.create(req.body, req.files);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Địa điểm bản đồ đã thêm',
      });
    } catch (error) {
      console.error('[MapPlace] create error:', error);
      res.status(500).json({ success: false, message: error.message, error: error.message });
    }
  },

  async update(req, res) {
    try {
      const result = await mapPlaceService.update(req.params.id, req.body, req.files);
      res.json({
        success: true,
        data: result,
        message: 'Đã cập nhật địa điểm',
      });
    } catch (error) {
      console.error('[MapPlace] update error:', error);
      res.status(500).json({ success: false, message: error.message, error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await mapPlaceService.delete(req.params.id);
      res.json({ success: true, message: 'Đã xóa địa điểm' });
    } catch (error) {
      console.error('[MapPlace] delete error:', error);
      res.status(500).json({ success: false, message: error.message, error: error.message });
    }
  },
};

module.exports = mapPlaceController;
