// src/services/map-place.service.js
const db = require('../config/db');
const path = require('path');
const fs = require('fs').promises;
const BASE_URL = process.env.BASE_URL || '';

class MapPlaceService {
  async getAll() {
    const result = await db.query(
      `SELECT id, name, address, coordinates, narration_audio_url, media_type, media_url, display_order, created_at
       FROM map_places
       ORDER BY display_order ASC, id ASC`
    );
    return result.rows.map(row => ({
      ...row,
      narration_audio_url: row.narration_audio_url ? BASE_URL + row.narration_audio_url : null,
      media_url: row.media_url ? BASE_URL + row.media_url : null,
    }));
  }

  async getById(id) {
    const result = await db.query(
      'SELECT * FROM map_places WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      narration_audio_url: row.narration_audio_url ? BASE_URL + row.narration_audio_url : null,
      media_url: row.media_url ? BASE_URL + row.media_url : null,
    };
  }

  async create(data, files) {
    const { name, address, coordinates, media_type = 'flat' } = data;

    const coords = typeof coordinates === 'string'
      ? (coordinates.trim().startsWith('[') ? JSON.parse(coordinates) : coordinates.split(',').map(Number))
      : coordinates;

    let narrationPath = null;
    if (files?.mapplace_narration?.[0]?.filename) {
      narrationPath = `/uploads/audio/${files.mapplace_narration[0].filename}`;
    }

    let mediaPath = null;
    if (files?.mapplace_image?.[0]?.filename) {
      mediaPath = `/uploads/mapplaces/${files.mapplace_image[0].filename}`;
    }

    const result = await db.query(
      `INSERT INTO map_places (name, address, coordinates, narration_audio_url, media_type, media_url, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, 0)
       RETURNING id`,
      [name, address || null, coords, narrationPath, media_type, mediaPath]
    );
    return { id: result.rows[0].id };
  }

  async update(id, data, files) {
    const existing = await db.query('SELECT * FROM map_places WHERE id = $1', [id]);
    if (existing.rows.length === 0) throw new Error('Map place not found');

    const { name, address, coordinates, media_type } = data;
    let narrationPath = existing.rows[0].narration_audio_url;
    let mediaPath = existing.rows[0].media_url;

    if (files?.mapplace_narration?.[0]?.filename) {
      if (existing.rows[0].narration_audio_url) {
        try {
          await fs.unlink(path.join(__dirname, '../..', existing.rows[0].narration_audio_url));
        } catch (e) { /* ignore */ }
      }
      narrationPath = `/uploads/audio/${files.mapplace_narration[0].filename}`;
    }

    if (files?.mapplace_image?.[0]?.filename) {
      if (existing.rows[0].media_url) {
        try {
          await fs.unlink(path.join(__dirname, '../..', existing.rows[0].media_url));
        } catch (e) { /* ignore */ }
      }
      mediaPath = `/uploads/mapplaces/${files.mapplace_image[0].filename}`;
    }

    const coords = typeof coordinates === 'string'
      ? (coordinates.trim().startsWith('[') ? JSON.parse(coordinates) : coordinates.split(',').map(Number))
      : (coordinates ?? existing.rows[0].coordinates);

    await db.query(
      `UPDATE map_places SET
        name = $1, address = $2, coordinates = $3, narration_audio_url = $4, media_type = $5, media_url = $6, updated_at = NOW()
       WHERE id = $7`,
      [name ?? existing.rows[0].name, address ?? existing.rows[0].address, coords, narrationPath, media_type ?? existing.rows[0].media_type, mediaPath, id]
    );
    return { id };
  }

  async delete(id) {
    const result = await db.query('SELECT narration_audio_url, media_url FROM map_places WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new Error('Map place not found');

    await db.query('DELETE FROM map_places WHERE id = $1', [id]);

    const row = result.rows[0];
    if (row.narration_audio_url) {
      try {
        await fs.unlink(path.join(__dirname, '../..', row.narration_audio_url));
      } catch (e) { /* ignore */ }
    }
    if (row.media_url) {
      try {
        await fs.unlink(path.join(__dirname, '../..', row.media_url));
      } catch (e) { /* ignore */ }
    }
    return true;
  }
}

module.exports = new MapPlaceService();
