// src/services/literature.service.js
const db = require('../config/db');

class LiteratureService {
  async getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await db.query(
      `SELECT * FROM literature ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const countResult = await db.query('SELECT COUNT(*) FROM literature');
    const total = parseInt(countResult.rows[0].count, 10);
    return {
      data: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const result = await db.query('SELECT * FROM literature WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const { title, content, image_url, author, genre, period } = data;
    const result = await db.query(
      `INSERT INTO literature (title, content, image_url, author, genre, period)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title || '', content || '', image_url || null, author || null, genre || null, period || null]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const { title, content, image_url, author, genre, period } = data;
    const result = await db.query(
      `UPDATE literature
       SET title = COALESCE($1, title), content = COALESCE($2, content),
           image_url = COALESCE($3, image_url), author = COALESCE($4, author),
           genre = COALESCE($5, genre), period = COALESCE($6, period), updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, content, image_url, author, genre, period, id]
    );
    if (result.rows.length === 0) throw new Error('Literature not found');
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM literature WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) throw new Error('Literature not found');
    return true;
  }
}

module.exports = new LiteratureService();
