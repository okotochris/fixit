async function createReviewTable(){
    const db = require('./db')
   try {
     db.query(` CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            job_id INT REFERENCES jobs(id),
            client_id INT REFERENCES users(id),
            worker_id INT REFERENCES users(id),
            rating INT CHECK(rating BETWEEN 1 AND 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `)
    console.log('Review table has been created ✅')
   } catch (error) {
    console.log(error)
   }
}

module.exports = createReviewTable