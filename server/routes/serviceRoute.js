const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.post('/get-workers', async (req, res) => {
  const { page = 1, limit = 50, latitude, longitude } = req.body;


  const lat = latitude;
  const lng = longitude;
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

// Backend Route: router.post('/workers/:category/nearby', ...)
router.post('/workers/:category/nearby', async (req, res) => {
  const { category } = req.params;
  const { latitude, longitude, limit = 30 } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude required" });
  }

  try {
    const result = await db.query(
      `
      SELECT 
        *,
        -- Calculate distance in kilometers using Haversine formula
        (6371 * acos(
          cos(radians($3)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($4)) + 
          sin(radians($3)) * sin(radians(latitude))
        )) AS distance
      FROM users
      WHERE 
        (
          skills ILIKE '%' || $1 || '%'
          OR EXISTS (
            SELECT 1 
            FROM unnest(services) s 
            WHERE s ILIKE '%' || $1 || '%'
          )
        )
        AND latitude IS NOT NULL 
        AND longitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT $2;
      `,
      [category, limit, latitude, longitude]
    );

    res.json({
      success: true,
      workers: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error("Nearby workers error:", error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
router.get("/professionals/sitemap", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT slug, created_at
      FROM users
      WHERE slug IS NOT NULL AND role = 'worker'
      ORDER BY  created_at DESC
    `);

    res.status(200).json(
      result.rows.map((pro) => ({
        slug: pro.slug,
        updatedAt: pro. created_at,
      }))
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch professionals sitemap data" });
  }
});
router.get("/jobs/sitemap", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT slug,  created_at
      FROM jobs
      WHERE slug IS NOT NULL
    `);

    res.status(200).json(
      result.rows.map((job) => ({
        slug: job.slug,
        updatedAt: job.created_at,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch jobs sitemap data" });
  }
});

router.get(('/workers/skills/sitemap'), async(req, res)=>{
  try{
    const result = await db.query('SELECT * FROM skill WHERE skill IS NOT NULL')
    res.status(200).json(result.rows.map((skill)=>({
      skill:skill.skill.toLowerCase(),
    
    })))
  
  }
  catch(err){
    console.error(err)
    res.status(500).json({message:"Failed to fetch skills"})
  }
})
module.exports = router;