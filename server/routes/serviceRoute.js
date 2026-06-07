const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.post('/get-workers', async (req, res) => {
  const { page = 1, limit = 10, location } = req.body;
  console.log("Received location:", location);

  const lat = location?.lat;
  const lng = location?.lng;

  const startIndex = (page - 1) * limit;

  try {
    let query;
    let values;

    // 🟢 If location exists → do GEO search
    if (lat && lng) {
      query = `
        SELECT id, fullname, phone, profilephoto, location, coverphoto,
               skills, rating, description, slug, services,
               latitude, longitude,
               (
                 6371 * acos(
                   cos(radians($1)) *
                   cos(radians(latitude)) *
                   cos(radians(longitude) - radians($2)) +
                   sin(radians($1)) *
                   sin(radians(latitude))
                 )
               ) AS distance
        FROM users
        WHERE role = $3
        ORDER BY distance ASC
        LIMIT $4 OFFSET $5
      `;

      values = [lat, lng, 'worker', limit, startIndex];
    } 
    // 🔴 fallback → normal pagination
    else {
      query = `
        SELECT id, fullname, phone, profilephoto, location, coverphoto,
               skills, rating, description, slug, services,
               latitude, longitude
        FROM users
        WHERE role = $1
        LIMIT $2 OFFSET $3
      `;

      values = ['worker', limit, startIndex];
    }

    const result = await db.query(query, values);

    const totalWorkers = await db.query(
      `SELECT COUNT(*) FROM users WHERE role=$1`,
      ['worker']
    );

    const totalPages = Math.ceil(totalWorkers.rows[0].count / limit);
    res.json({
      workers: result.rows,
      totalWorkers: totalWorkers.rows[0].count,
      currentPage: parseInt(page),
      totalPages,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

router.get('/workers/:category', async (req, res) => {
  const { category } = req.params;
  try {
   const result = await db.query(
        `
       SELECT *
        FROM users
        WHERE
        skills ILIKE '%' || $1 || '%'
        OR EXISTS (
            SELECT 1
            FROM unnest(services) s
            WHERE s ILIKE '%' || $1 || '%'
        );
        `,
        [category]
        );
    res.json(result.rows);
  

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});
module.exports = router;