const express = require('express')
const db = require('../database/db')
const isAuthenticated = require('../middleware/isAuthenticated')

const router = express.Router()

router.post('/job_request', isAuthenticated, async(req, res)=>{
    const {} = req.body;
} )

module.exports = router