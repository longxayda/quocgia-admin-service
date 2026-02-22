// src/services/economics.service.js
const db = require('../config/db');

class EconomicsService {
  async getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await db.query(
      `SELECT * FROM economics ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const countResult = await db.query('SELECT COUNT(*) FROM economics');
    const total = parseInt(countResult.rows[0].count, 10);
    return {
      data: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const result = await db.query('SELECT * FROM economics WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const { title, content, image_url, sector, figures, source } = data;
    const result = await db.query(
      `INSERT INTO economics (title, content, image_url, sector, figures, source)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title || '', content || '', image_url || null, sector || null, figures || null, source || null]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const { title, content, image_url, sector, figures, source } = data;
    const result = await db.query(
      `UPDATE economics
       SET title = COALESCE($1, title), content = COALESCE($2, content),
           image_url = COALESCE($3, image_url), sector = COALESCE($4, sector),
           figures = COALESCE($5, figures), source = COALESCE($6, source), updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, content, image_url, sector, figures, source, id]
    );
    if (result.rows.length === 0) throw new Error('Economics not found');
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM economics WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) throw new Error('Economics not found');
    return true;
  }
}

module.exports = new EconomicsService();
