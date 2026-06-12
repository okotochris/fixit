const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../database/db'); // make sure path is correct
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/multer'); // multer setup
const cloudinary = require('../service/cloudinary'); // cloudinary config
const sendEmail = require('../service/brevo.js');


//SEND EMAIL TO WORKER THAT HIS SERVICE IS REQUESTED
function sendEmailToWorker(email, workerName, clientName, jobTitle, slug) {
 const text = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

    <h1 style="color: #1a73e8; margin-bottom: 5px;">serviceHub</h1>
    <p style="color: #999; font-size: 13px; margin-top: 0;">
      Trusted service marketplace
    </p>

    <h2 style="color: #333; margin-top: 25px;">New Service Request</h2>

    <p style="color: #666; font-size: 15px;">
      Hello, ${workerName}!<br/><br/>
      You have received a new service request from
      <strong>${clientName}</strong> for
      <strong>${jobTitle}</strong>.
    </p>

    <div style="margin: 25px 0;">
      <a
        href="https://servicehub.space/job/${slug}"
        style="
          display: inline-block;
          background: #1a73e8;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        View Job Details
      </a>
    </div>

    <p style="color: #888; font-size: 13px;">
      You have 24 hours to accept or reject this job request before it expires.
    </p>

    <p style="color: #aaa; font-size: 12px; margin-top: 30px;">
      © ${new Date().getFullYear()} serviceHub. All rights reserved.
    </p>

  </div>
</div>
`;
  
    sendEmail(email, text);
}

// JOB REQUEST API
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
      // Fetch client and worker full names
      const clientResult = await db.query('SELECT fullname FROM users WHERE id=$1', [client_id]);
      if (!clientResult.rows[0]) return res.status(404).json({ message: "Client not found" });
      const workerResult = await db.query('SELECT fullname, email FROM users WHERE id=$1', [worker_id]);
      if (!workerResult.rows[0]) return res.status(404).json({ message: "Worker not found" });

      const clientFullName = clientResult.rows[0].fullname;
      const workerFullName = workerResult.rows[0].fullname;
      const workerEmail = workerResult.rows[0].email;

      // Upload images to Cloudinary
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
      const job = await db.query(`
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

      // Return the created job
      res.status(200).json({
        message: 'Job request received successfully',
        job: job.rows[0]
      });
       sendEmailToWorker(workerEmail, workerFullName, clientFullName, job_title, slug)

    } catch (err) {
      console.error('Error processing job request:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

//GET JOB BASE ON SLUG
router.get('/job_request', async(req, res)=>{
    const slug = req.query.slug;
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

            return       
        }
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

// JOBS AVAILABLE API - Sorted by Nearest
router.post('/available_jobs', async (req, res) => {

  try {
    const { lat, lng, limit = 20, radius = 50 } = req.body; // radius in km (optional)

    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: "Latitude and Longitude are required" 
      });
    }

    const result = await db.query(
      `
      SELECT 
        *,
        -- Haversine Formula: Distance in kilometers
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance
      FROM jobs
      WHERE 
        status = $3
        AND latitude IS NOT NULL 
        AND longitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT $4;
      `,
      [lat, lng, 'pending', Number(limit)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No jobs available near you" 
      });
    }

    res.status(200).json({
      success: true,
      jobs: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error("Available Jobs Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
});

// ACCEPT JOB
router.patch('/accept_job', async (req, res) => {
  const id = req.query.id;
  const worker_id = req.query.worker_id

  try {
    const result = await db.query(
      'UPDATE jobs SET status = $1, worker_id = $2 WHERE id = $3 RETURNING *',
      ['accepted', worker_id, id]
    );

    if (result.rowCount < 1) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job status updated",
      job: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// REJECT JOB
router.patch('/reject_job', async (req, res) => {
  const id = req.query.id;
  const worker_id = req.query.worker_id

  try {
    const result = await db.query(
      'UPDATE jobs SET status = $1, worker_id = null WHERE id = $3 AND worker_id = $2 RETURNING *',
      ['pending', worker_id, id]
    );

    if (result.rowCount < 1) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job status updated",
      job: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get('/job_info', async(req, res)=>{
  const slug = req.query.slug;
  const client_id = req.query.client_id;

  try {
   const result = await db.query(
  `SELECT 
      jobs.job_title,
      jobs.description,
      users.fullname AS worker_fullname,
      users.profilephoto AS worker_profilephoto,
      users.slug AS worker_slug
      FROM jobs
      JOIN users 
        ON jobs.worker_id = users.id
      WHERE jobs.slug = $1 AND jobs.client_id = $2`,
      [slug, client_id]
    );

    if (result.rows.length < 1) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;