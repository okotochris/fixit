const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../database/db'); // make sure path is correct
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/multer'); // multer setup
const cloudinary = require('../service/cloudinary'); // cloudinary config

router.post(
  '/job_request',
  isAuthenticated,
  upload.array('job_photos'), // handle multiple images
  async (req, res) => {
    try {
      // Destructure text fields
      const {
        client_id,
        worker_id,
        service_type,
        job_title,
        description,
        scheduled_date,
        address,
        time,
        latitude,
        longitude
      } = req.body;
      console.log(req.body)
      // Fetch client and worker full names
      const clientResult = await db.query('SELECT fullname FROM users WHERE id=$1', [client_id]);
      if (!clientResult.rows[0]) return res.status(404).json({ message: "Client not found" });
      const workerResult = await db.query('SELECT fullname FROM users WHERE id=$1', [worker_id]);
      if (!workerResult.rows[0]) return res.status(404).json({ message: "Worker not found" });

      const clientFullName = clientResult.rows[0].fullname;
      const workerFullName = workerResult.rows[0].fullname;

      // Upload images to Cloudinary
      console.log(req.files)
      let uploadedImages = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, { folder: 'job_photos' });
          uploadedImages.push(result.secure_url);
          fs.unlinkSync(file.path); // delete local file
        }
      }

      // Insert job into database WITHOUT slug first
      const insertQuery = `
        INSERT INTO jobs (
          client_id,
          worker_id,
          service_type,
          job_title,
          description,
          scheduled_date,
          address,
          time,
          job_photos,
          latitude,
          longitude
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING id;
      `;

      const insertValues = [
        client_id,
        worker_id,
        service_type,
        job_title,
        description,
        scheduled_date,
        address,
        time,
        uploadedImages,
        latitude,
        longitude
      ];

      const jobResult = await db.query(insertQuery, insertValues);
      const jobId = jobResult.rows[0].id;

      // Generate slug: clientFirst-workerFirst-id
      const slug = `${clientFullName.split(' ')[0].toLowerCase()}-${workerFullName.split(' ')[0].toLowerCase()}-${jobId}`;

      // Update job with slug
      await db.query('UPDATE jobs SET slug=$1 WHERE id=$2', [slug, jobId]);

      // Return the created job
      res.status(200).json({
        message: 'Job request received successfully',
        job: { slug, service_type, job_title, description, scheduled_date, address, time, job_photos: uploadedImages }
      });

    } catch (err) {
      console.error('Error processing job request:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

//GET JOB BASE ON SLUG
router.get('/job_request', async(req, res)=>{
    const slug = req.query.slug;
  console.log(slug)
    try {
      const result = await db.query(`
        SELECT 
            jobs.*,
            users.fullname AS client_fullname,
            users.slug AS client_slug,
            users.phone AS client_contact,
            users.profilePhoto as client_photo
            FROM jobs
            JOIN users ON jobs.client_id = users.id
            WHERE jobs.slug = $1
            `, [slug]);
        if(result.rows.length <1){
            res.status(404).json({message:"file not found"}) 
            console.log(result.rows)
            return       
        }
        console.log("result", result.rows)
        res.status(200).json(result.rows[0])

    } catch (error) {
        res.status(500).json({message:"server error"})
    }
})

router.post("/reviews", async (req, res) => {
  try {
    const { job_id, client_id, worker_id, rating, comment } = req.body;

    // prevent duplicate rating
    const existing = await db.query(
      `SELECT * FROM reviews WHERE job_id = $1`,
      [job_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already rated" });
    }

    // insert review
    const newReview = await db.query(
      `INSERT INTO reviews (job_id, client_id, worker_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [job_id, client_id, worker_id, rating, comment]
    );

    // recalc rating
    const ratingsRes = await db.query(
      `SELECT rating FROM reviews WHERE worker_id = $1`,
      [worker_id]
    );

    const ratings = ratingsRes.rows.map((r) => r.rating);

    const avg =
      ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

    // update user
    await db.query(
      `UPDATE users SET rating = $1 WHERE id = $2`,
      [avg, worker_id]
    );

    res.status(201).json({
      message: "Review added",
      rating: avg,
      review: newReview.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;