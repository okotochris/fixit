
const db = require('../database/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 async function login(req, res, next){
    async(req, res)=>{
    const {email, password} = req.body;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if(result.rows.length === 0){
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = jwt.sign({email}, process.env.JWT_SECRET);
    const userDetails = {password, ...user};
    res.json({token, userDetails});
    console.log(userDetails);
}}

module.exports={
    login,
}