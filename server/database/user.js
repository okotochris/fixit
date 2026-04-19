function createUsersDatabase(){
    const db = require('./db')

    try {
        db.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            fullName VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20) NOT NULL,
            location VARCHAR(255) NOT NULL,
            address TEXT,
            terms BOOLEAN NOT NULL,
            skills TEXT,
            services TEXT[],
            hourlyRate TEXT,
            profilePhoto TEXT,
            profilePhotoPublicId TEXT,
            coverPhoto TEXT,
            coverPhotoPublicId TEXT,
            image TEXT[],
            description TEXT,
            slug TEXT UNIQUE,
            rating FLOAT,
            totalReviews INT,
            latitude FLOAT,
            longitude  FLOAT,
            isVerified BOOLEAN DEFAULT FALSE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'client',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`)
        console.log("Users table created successfully ✅ ")
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = createUsersDatabase;