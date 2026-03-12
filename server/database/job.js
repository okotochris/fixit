async function createJobTable() {
  const db = require('./db')
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        client_id INT REFERENCES users(id) ON DELETE SET NULL,
        worker_id INT REFERENCES users(id) ON DELETE SET NULL,
        service_type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, completed, reviewed
        description TEXT,
        scheduled_date TIMESTAMP,
        client_photos TEXT[],
        worker_photos TEXT[],
        quote_amount NUMERIC,
        slug TEXT,
        quote_status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log("Jobs table created ✅")
  } catch (error) {
    console.log(error)
  }
}

module.exports = createJobTable