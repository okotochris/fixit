const express = require('express')
const db = require('../database/db')

const router = express.Router()
router.get('/get-user', async (req, res) => {
  const slug = req.query.slug;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE slug=$1',
      [slug]
    );

    if (result.rows.length < 1) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Remove password properly
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;