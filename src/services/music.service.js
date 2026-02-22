// src/services/music.service.js
const db = require('../config/db');

class MusicService {

  // =============================
  // CREATE MANY (multiple links)
  // =============================
  async createMany(links = []) {

    if (!Array.isArray(links) || links.length === 0) {
      throw new Error('Links must be a non-empty array');
    }

    const insertedIds = [];

    for (const link of links) {
      if (link && link.trim()) {
        const result = await db.query(
          `INSERT INTO music (youtube_url)
           VALUES ($1)
           RETURNING id`,
          [link.trim()]
        );

        insertedIds.push(result.rows[0].id);
      }
    }

    return { inserted_ids: insertedIds };
  }


  // =============================
  // GET ALL (with pagination)
  // =============================
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT *
       FROM music
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM music');
    const total = parseInt(countResult.rows[0].count);

    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }


  // =============================
  // GET BY ID
  // =============================
  async getById(id) {
    const result = await db.query(
      `SELECT * FROM music WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }


  // =============================
  // UPDATE
  // =============================
  async update(id, data) {
    const { youtube_url } = data;

    const result = await db.query(
      `UPDATE music
       SET youtube_url = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [youtube_url, id]
    );

    if (result.rows.length === 0) {
      throw new Error('Music not found');
    }

    return result.rows[0];
  }


  // =============================
  // DELETE
  // =============================
  async delete(id) {
    const result = await db.query(
      `DELETE FROM music
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Music not found');
    }

    return true;
  }

}

module.exports = new MusicService();
