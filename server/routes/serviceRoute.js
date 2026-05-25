const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/get-workers', async (req, res)=>{
    const {page = 1, limit = 10} = req.query
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const nextPage = parseInt(page) + 1
    const prevPage = parseInt(page) - 1
    try {
        const result = await db.query(
            `SELECT id, fullname, phone, profilephoto, location, coverphoto, 
            skills, rating, description, slug, services, latitude, 
            longitude FROM users WHERE role=$1 LIMIT $2 OFFSET $3`, 
            ['worker', limit, parseInt(startIndex)])
      
        const totalWorkers = await db.query(`SELECT COUNT(*) FROM users WHERE role=$1`, ['worker'])
        const data = {}
        if (endIndex < totalWorkers.rows[0].count) {
            data.next = {
                page: nextPage,
                limit: parseInt(limit)
            }
        }
        if (startIndex > 0) {
            data.prev = {
                page: prevPage,
                limit: parseInt(limit)
            }
        }
        const totalPages = Math.ceil(totalWorkers.rows[0].count / parseInt(limit))
        data.workers = result.rows

        // Add total workers and pagination info to the response
        data.totalWorkers = totalWorkers.rows[0].count
        data.currentPage = parseInt(page)
        data.totalPages = totalPages
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message:"server error"})
        console.log(error)
    }
})


module.exports = router;