// src/services/geography.service.js
const db = require('../config/db');

class GeographyService {
  async getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await db.query(
      `SELECT * FROM geography ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const countResult = await db.query('SELECT COUNT(*) FROM geography');
    const total = parseInt(countResult.rows[0].count, 10);
    return {
      data: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const result = await db.query('SELECT * FROM geography WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const { title, content, image_url, region, area, terrain } = data;
    const result = await db.query(
      `INSERT INTO geography (title, content, image_url, region, area, terrain)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title || '', content || '', image_url || null, region || null, area || null, terrain || null]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const { title, content, image_url, region, area, terrain } = data;
    const result = await db.query(
      `UPDATE geography
       SET title = COALESCE($1, title), content = COALESCE($2, content),
           image_url = COALESCE($3, image_url), region = COALESCE($4, region),
           area = COALESCE($5, area), terrain = COALESCE($6, terrain), updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, content, image_url, region, area, terrain, id]
    );
    if (result.rows.length === 0) throw new Error('Geography not found');
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM geography WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) throw new Error('Geography not found');
    return true;
  }
}

module.exports = new GeographyService();
