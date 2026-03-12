const express = require('express');
const router = express.Router();
const db = require('../database/db');
const upload = require('../middleware/multer')
const cloudinary = require('../service/cloudinary')

router.post('/update-about', async (req, res)=>{
    const {userId, about} = req.body;
    try {
        await db.query(`UPDATE users SET description = $1 WHERE id = $2`, [about, userId]);
        res.status(200).json({message: 'About info updated successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Internal server error'});
    }
})

router.post('/update-location', async (req, res)=>{
    const {email, location} = req.body;
    try {
        await db.query(`UPDATE users SET location = $1 WHERE email = $2`, [location, email]);
        res.status(200).json({message: 'Location updated successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Internal server error'});
    }
})

//UPDATE COVER PHOTO
router.post('/upload-cover', upload.single('photo'), async (req, res) => {
    try {
      // 1. Make sure we have a file
      if (!req.file) {
        return res.status(400).json({ message: 'No cover photo file uploaded' });
      }

      // 2. Get user ID (you'll probably want to get this from auth middleware)
      //    For this example I'm assuming you have req.user from JWT/passport/etc.
      const userId = req.query.id; // ← ADJUST THIS based on your auth system

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - user ID not found' });
      }

      // 3. Get current cover photo public_id (so we can delete old one)
      const result = await db.query(
        'SELECT coverphotopublicid FROM users WHERE id = $1',
        [userId]
      );

      const oldPublicId = result.rows[0]?.coverphotopublicid;

      // 4. Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path)
    
      // 5. Delete old image from Cloudinary (if it existed)
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log(`Deleted old cover photo: ${oldPublicId}`);
        } catch (deleteErr) {
          console.warn('Failed to delete old Cloudinary image:', deleteErr.message);
          // → usually safe to continue (don't fail the whole request)
        }
      }

      // 6. Save new URL and public_id to database
      await db.query(
        `UPDATE users 
         SET coverphoto = $1, 
             coverphotopublicid = $2 
         WHERE id = $3`,
        [uploadResult.secure_url, uploadResult.public_id, userId]
      );

      // 7. Send success response
      return res.status(200).json({
        message: 'Cover photo updated successfully',
        url: uploadResult.secure_url,
      });
    } catch (error) {
      console.error('Cover photo upload error:', error);
      return res.status(500).json({
        message: 'Failed to upload cover photo',
        error: error.message,
      });
    }
  }
);
//UPDATE PROFILE PHOTO
router.post('/upload-profilephoto', upload.single('photo'), async (req, res) => {
    try {
      // 1. Make sure we have a file
      if (!req.file) {
        return res.status(400).json({ message: 'No cover photo file uploaded' });
      }

      // 2. Get user ID (you'll probably want to get this from auth middleware)
      //    For this example I'm assuming you have req.user from JWT/passport/etc.
      const userId = req.query.id; // ← ADJUST THIS based on your auth system

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - user ID not found' });
      }

      // 3. Get current cover photo public_id (so we can delete old one)
      const result = await db.query(
        'SELECT profilephotopublicid FROM users WHERE id = $1',
        [userId]
      );

      const oldPublicId = result.rows[0]?.profilePhotoPublicId;

      // 4. Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path)
    
      // 5. Delete old image from Cloudinary (if it existed)
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log(`Deleted old cover photo: ${oldPublicId}`);
        } catch (deleteErr) {
          console.warn('Failed to delete old Cloudinary image:', deleteErr.message);
          // → usually safe to continue (don't fail the whole request)
        }
      }

      // 6. Save new URL and public_id to database
      await db.query(
        `UPDATE users 
         SET profilephoto = $1, 
             profilephotopublicid = $2 
         WHERE id = $3`,
        [uploadResult.secure_url, uploadResult.public_id, userId]
      );

      // 7. Send success response
      return res.status(200).json({
        message: 'Cover photo updated successfully',
        url: uploadResult.secure_url,
      });
    } catch (error) {
      console.error('Cover photo upload error:', error);
      return res.status(500).json({
        message: 'Failed to upload cover photo',
        error: error.message,
      });
    }
  }
);
//UPDATE USER WORK IMAGES
router.post('/upload-workphoto', upload.single('photo'), async (req, res) => {
    try {
      // 1. Make sure we have a file
      if (!req.file) {
        return res.status(400).json({ message: 'No Images uploaded' });
      }

      // 2. Get user ID (you'll probably want to get this from auth middleware)
      //    For this example I'm assuming you have req.user from JWT/passport/etc.
      const userId = req.query.id; // ← ADJUST THIS based on your auth system

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - user ID not found' });
      }

      // 4. Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path)
    
      // 6. Save new URL  to database
   await db.query(
  `UPDATE users 
   SET image = array_append(image, $1)
   WHERE id = $2`,
  [uploadResult.secure_url, userId]
);

      // 7. Send success response
      return res.status(200).json({
        message: ' photo updated successfully',
        url: uploadResult.secure_url,
      });
    } catch (error) {
      console.error(' photo upload error:', error);
      return res.status(500).json({
        message: 'Failed to upload cover photo',
        error: error.message,
      });
    }
  }
);

//DELETE IMAGE 
router.post('/delete_image', async(req, res)=>{
  const id = req.query.id
  const image = req.query.service
  try {
    const result = await db.query('UPDATE users SET images = array_remove(image, $1) WHERE id= $2 RETURNING *')
    if(!result.rows.length > 0){
      return res.status(404).json({message:"file not found"})
    }
    res.status(200).json({message:"file deleted"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"internal server error"})
  }
})

//UPDAATE USER SERVICE
router.post('/update-services', async (req, res)=>{
    const id = req.query.id
    const {services} = req.body;
    console.log(services)
    try {
        await db.query(`UPDATE users SET services = array_append(services, $1) WHERE id = $2`, [services, id]);
        res.status(200).json({message: 'Services updated successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Internal server error'});
    }
})

//DELETE USER SERVICE
router.delete('/delete_service', async(req, res)=>{
  const id = req.query.id;
  const service = req.body.service
  console.log(id, service)
  try {
    const ressult = await db.query(
  'UPDATE users SET services = array_remove(services, $1) WHERE id = $2 RETURNING *',
    [service, id]
  );
  if(!ressult.rows.length > 0){
    return res.status(404).json({message:"file not found"})
  }
  res.status(200).json({message:"deleted"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"internal server error"})
  }
})

module.exports = router;