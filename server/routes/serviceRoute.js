const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/get-workers', async (req, res)=>{
    try {
        const data = await db.query(`SELECT fullname, address, profilephoto, location, coverphoto, skills as profession, rating, description, slug FROM users WHERE role=$1`, ['worker'])
        res.status(200).json(data.rows)
    } catch (error) {
        res.status(500).json({message:"server error"})
        console.log(error.message)
    }
})


module.exports = router;