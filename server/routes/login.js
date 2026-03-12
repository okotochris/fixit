const express = require('express');
const db = require('../database/db.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { storage } = require('../service/cloudinary');
const sendEmail = require('../service/brevo');
const cloudinary = require('../service/cloudinary');
const generateSlug = require('../helper/generateSlug');
const upload = require('../middleware/multer.js')
const jwt = require('jsonwebtoken');
const router = express.Router();


function generateCode() {
  const number = crypto.randomInt(10000, 100000); 
  return number.toString();
}

router.post('/login', async (req, res)=>{
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
})

router.post('/signup', upload.single('profilePhoto'), async (req, res)=>{
    const {email} = req.body;
    req.body.profilePhoto = ""
    if (req.file) {
      req.body.profilePhoto = req.file.path; 
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const code = generateCode();
    const text = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <h1 style="color: #1a73e8; margin-bottom: 5px;">FixIt</h1>
        <p style="color: #999; font-size: 13px; margin-top: 0;">
          Trusted service marketplace
        </p>

        <h2 style="color: #333; margin-top: 25px;">Email Verification</h2>
        
        <p style="color: #666; font-size: 15px;">
          Hello,<br/><br/>
          Use the verification code below to complete your registration on <strong>FixIt</strong>.
        </p>

        <div style="margin: 25px 0;">
          <span style="
            display: inline-block;
            font-size: 28px;
            letter-spacing: 8px;
            font-weight: bold;
            color: #1a73e8;
            background: #f1f7ff;
            padding: 15px 25px;
            border-radius: 8px;
          ">
            ${code}
          </span>
        </div>

        <p style="color: #888; font-size: 13px;">
          This code will expire in 5 minutes.
        </p>

        <p style="color: #aaa; font-size: 12px; margin-top: 30px;">
          © ${new Date().getFullYear()} FixIt. All rights reserved.
        </p>

      </div>
    </div> `;
    //sendEmail(email, text);
    try {
       await db.query(`INSERT INTO pending_users (email, code, userinfo) VALUES ($1,$2,$3)`, [email, code, req.body]);
        res.status(200).json({message: 'Verification code sent to email'});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Internal server error'});
    }
    
})

router.post('/verify-email', async (req, res) => {
  const { email: userEmail, code } = req.body; // avoid overwriting 'email'
  let profilePublicId = ""; // for cloudinary

  try {
    // 1️⃣ Check if the code exists in pending_users
    const pendingResult = await db.query(
      `SELECT * FROM pending_users WHERE email = $1 AND code = $2`,
      [userEmail, code]
    );

    if (pendingResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid code or email' });
    }

    // 2️⃣ Extract user info
    const { userinfo } = pendingResult.rows[0];
    let { fullName, email, phone, terms, skills, profilePhoto, password,location, role } = userinfo;

    // 3️⃣ Upload profile photo if exists
    if (profilePhoto) {
      const cloudResult = await cloudinary.uploader.upload(profilePhoto);
      profilePhoto = cloudResult.secure_url;
      profilePublicId = cloudResult.public_id;
    }

    // 4️⃣ Insert into main users table
    const userResult = await db.query(
      `INSERT INTO users (fullName, email, phone, terms, skills, profilephoto, password, profilePhotoPublicId, location, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [fullName, email, phone, terms, skills, profilePhoto, password, profilePublicId, location, role]
    );

    // 5️⃣ Generate slug and update user record
    const userInfo = userResult.rows[0];
    const userid = userInfo.id;
    const slug = generateSlug(fullName, userid);
    await db.query(`UPDATE users SET slug = $1 WHERE email = $2`, [slug, email]);

    // 5️⃣ Remove from pending_users
    await db.query(`DELETE FROM pending_users WHERE email = $1`, [userEmail]);

    // 6️⃣ Generate JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userDetails = { password, ...userInfo, slug };
    res.status(200).json({ token, userDetails });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/check_email', async (req, res)=>{
  const {email} = req.query;
  const result = await db.query('SELECT email FROM users WHERE email=$1',[email])

  if(result.rows.length > 0){
      console.log(result.rows)
    return res.status(200).json(true)
  }
    console.log(result.rows)
  return res.status(404).json(false)
})

module.exports = router;