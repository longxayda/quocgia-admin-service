// src/controllers/admin.controller.js
const heritageService = require('../services/heritage.service');
const musicService = require('../services/music.service');
const fineArtService = require('../services/fineart.service');
const economicsService = require('../services/economics.service');
const geographyService = require('../services/geography.service');
const literatureService = require('../services/literature.service');

const adminController = {
  // Tạo mới
  async create(req, res) {
    try {
      console.log('[Admin Controller] Creating heritage...');
      console.log('Body:', req.body);
      console.log('Files:', {
        image: req.files?.image?.length || 0,
        audio: req.files?.audio?.length || 0,
        gallery: req.files?.gallery?.length || 0
      });

      const result = await heritageService.create(req.body, req.files);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Heritage created successfully'
      });
    } catch (error) {
      console.error('[Admin Controller] Create error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Danh sách (admin - không cần lang)
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await heritageService.getAll('vi', +page, +limit);
      res.json({ success: true, ...result });
    } catch (error) {
      console.error('[Admin Controller] GetAll error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Chi tiết
  async getById(req, res) {
    try {
      const result = await heritageService.getById(req.params.id, 'vi');
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Heritage not found',
          error: 'Heritage not found'
        });
      }
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('[Admin Controller] GetById error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Cập nhật
  async update(req, res) {
    try {
      const { id } = req.params;

      console.log('[Admin Controller] Updating heritage:', id);
      console.log('Body:', req.body);
      console.log('Files:', {
        image: req.files?.image?.length || 0,
        audio: req.files?.audio?.length || 0,
        gallery: req.files?.gallery?.length || 0
      });

      // Kiểm tra heritage tồn tại
      const existing = await heritageService.getById(id, 'vi');
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Heritage not found',
          error: 'Heritage not found'
        });
      }

      const result = await heritageService.update(id, req.body, req.files);

      res.json({
        success: true,
        data: result,
        message: 'Heritage updated successfully'
      });
    } catch (error) {
      console.error('[Admin Controller] Update error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Xóa
  async delete(req, res) {
    try {
      const { id } = req.params;

      console.log('[Admin Controller] Deleting heritage:', id);

      // Kiểm tra heritage tồn tại
      const existing = await heritageService.getById(id, 'vi');
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Heritage not found',
          error: 'Heritage not found'
        });
      }

      await heritageService.delete(id);

      res.json({
        success: true,
        message: 'Heritage deleted successfully'
      });
    } catch (error) {
      console.error('[Admin Controller] Delete error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },
  // ===============================
  // MUSIC MANAGEMENT
  // ===============================

  // Tạo nhiều music link
  async createMusic(req, res) {
    try {
      console.log('[Admin Controller] Creating music...');
      console.log('Body:', req.body);

      const { links } = req.body;

      if (!links || !Array.isArray(links) || links.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Links phải là một mảng youtube_url',
          error: 'Links phải là một mảng youtube_url'
        });
      }

      // Validate YouTube links
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}$/;
      const invalidLinks = links.filter(link => !youtubeRegex.test(link));
      if (invalidLinks.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Có link YouTube không hợp lệ',
          error: 'Có link YouTube không hợp lệ',
          invalidLinks
        });
      }

      const result = await musicService.createMany(links);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Music created successfully'
      });

    } catch (error) {
      console.error('[Admin Controller] CreateMusic error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },


  // Lấy danh sách music
  async getAllMusic(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await musicService.getAll(+page, +limit);
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('[Admin Controller] GetAllMusic error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },


  // Lấy chi tiết 1 music
  async getMusicById(req, res) {
    try {
      const { id } = req.params;

      const result = await musicService.getById(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Music not found',
          error: 'Music not found'
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('[Admin Controller] GetMusicById error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },


  // Cập nhật 1 music
  async updateMusic(req, res) {
    try {
      const { id } = req.params;
      const { youtube_url, title } = req.body;

      const existing = await musicService.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Music not found',
          error: 'Music not found'
        });
      }

      const result = await musicService.update(id, {
        youtube_url,
        title
      });

      res.json({
        success: true,
        data: result,
        message: 'Music updated successfully'
      });

    } catch (error) {
      console.error('[Admin Controller] UpdateMusic error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },


  // Xóa music
  async deleteMusic(req, res) {
    try {
      const { id } = req.params;

      const existing = await musicService.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Music not found',
          error: 'Music not found'
        });
      }

      await musicService.delete(id);

      res.json({
        success: true,
        message: 'Music deleted successfully'
      });

    } catch (error) {
      console.error('[Admin Controller] DeleteMusic error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },
  // ===============================
  // FINE ART MANAGEMENT
  // ===============================

  // Tạo fineart (upload nhiều ảnh)
  async createFineArt(req, res) {
    try {
      console.log('[Admin Controller] Creating fineart...');
      console.log('Files:', req.files?.fineart?.length || 0);

      if (!req.files || !req.files.fineart || req.files.fineart.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Vui lòng upload ít nhất một ảnh'
        });
      }

      const files = req.files.fineart;

      // Tạo url cho từng file
      const fineartUrls = files.map(file => {
        return `/uploads/fineart/${file.filename}`;
      });

      const result = await fineArtService.createMany(fineartUrls);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Fineart uploaded successfully'
      });

    } catch (error) {
      console.error('[Admin Controller] CreateFineArt error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Lấy danh sách fineart
  async getAllFineArt(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const result = await fineArtService.getAll(+page, +limit);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      console.error('[Admin Controller] GetAllFineArt error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Lấy chi tiết 1 fineart
  async getFineArtById(req, res) {
    try {
      const { id } = req.params;

      const result = await fineArtService.getById(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Fine art not found',
          error: 'Fine art not found'
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('[Admin Controller] GetFineArtById error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Xóa fineart
  async deleteFineArt(req, res) {
    try {
      const { id } = req.params;

      const existing = await fineArtService.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Fine art not found',
          error: 'Fine art not found'
        });
      }

      await fineArtService.delete(id);

      res.json({
        success: true,
        message: 'Fineart deleted successfully'
      });

    } catch (error) {
      console.error('[Admin Controller] DeleteFineArt error:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // ===============================
  // ECONOMICS (Thông tin kinh tế)
  // ===============================
  async getAllEconomics(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await economicsService.getAll(+page, +limit);
      res.json({ success: true, ...result });
    } catch (error) {
      console.error('[Admin Controller] GetAllEconomics error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async getEconomicsById(req, res) {
    try {
      const result = await economicsService.getById(req.params.id);
      if (!result) return res.status(404).json({ success: false, error: 'Economics not found' });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async createEconomics(req, res) {
    try {
      const { title, content, image_url, sector, figures, source } = req.body || {};
      const result = await economicsService.create({ title, content, image_url, sector, figures, source });
      res.status(201).json({ success: true, data: result, message: 'Economics created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async updateEconomics(req, res) {
    try {
      const { title, content, image_url, sector, figures, source } = req.body || {};
      const result = await economicsService.update(req.params.id, { title, content, image_url, sector, figures, source });
      res.json({ success: true, data: result, message: 'Economics updated successfully' });
    } catch (error) {
      if (error.message === 'Economics not found') return res.status(404).json({ success: false, error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async deleteEconomics(req, res) {
    try {
      await economicsService.delete(req.params.id);
      res.json({ success: true, message: 'Economics deleted successfully' });
    } catch (error) {
      if (error.message === 'Economics not found') return res.status(404).json({ success: false, error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ===============================
  // GEOGRAPHY (Địa lý)
  // ===============================
  async getAllGeography(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await geographyService.getAll(+page, +limit);
      res.json({ success: true, ...result });
    } catch (error) {
      console.error('[Admin Controller] GetAllGeography error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async getGeographyById(req, res) {
    try {
      const result = await geographyService.getById(req.params.id);
      if (!result) return res.status(404).json({ success: false, error: 'Geography not found' });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async createGeography(req, res) {
    try {
      const { title, content, image_url, region, area, terrain } = req.body || {};
      const result = await geographyService.create({ title, content, image_url, region, area, terrain });
      res.status(201).json({ success: true, data: result, message: 'Geography created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async updateGeography(req, res) {
    try {
      const { title, content, image_url, region, area, terrain } = req.body || {};
      const result = await geographyService.update(req.params.id, { title, content, image_url, region, area, terrain });
      res.json({ success: true, data: result, message: 'Geography updated successfully' });
    } catch (error) {
      if (error.message === 'Geography not found') return res.status(404).json({ success: false, error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async deleteGeography(req, res) {
    try {
      await geographyService.delete(req.params.id);
      res.json({ success: true, message: 'Geography deleted successfully' });
    } catch (error) {
      if (error.message === 'Geography not found') return res.status(404).json({ success: false, error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ===============================
  // LITERATURE (Văn học)
  // ===============================
  async getAllLiterature(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await literatureService.getAll(+page, +limit);
      res.json({ success: true, ...result });
    } catch (error) {
      console.error('[Admin Controller] GetAllLiterature error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async getLiteratureById(req, res) {
    try {
      const result = await literatureService.getById(req.params.id);
      if (!result) return res.status(404).json({ success: false, error: 'Literature not found' });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async createLiterature(req, res) {
    try {
      const { title, content, image_url, author, genre, period } = req.body || {};
      const result = await literatureService.create({ title, content, image_url, author, genre, period });
      res.status(201).json({ success: true, data: result, message: 'Literature created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async updateLiterature(req, res) {
    try {
      const { title, content, image_url, author, genre, period } = req.body || {};
      const result = await literatureService.update(req.params.id, { title, content, image_url, author, genre, period });
      res.json({ success: true, data: result, message: 'Literature updated successfully' });
    } catch (error) {
      if (error.message === 'Literature not found') return res.status(404).json({ success: false, error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async deleteLiterature(req, res) {
    try {
      await literatureService.delete(req.params.id);
      res.json({ success: true, message: 'Literature deleted successfully' });
    } catch (error) {
      if (error.message === 'Literature not found') return res.status(404).json({ success: false, error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = adminController;