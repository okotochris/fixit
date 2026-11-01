const db = require('./db');

async function createSupervisorDatabase() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS supervisor (
                id SERIAL PRIMARY KEY,

                userId INTEGER REFERENCES users(id) ON DELETE SET NULL,
               
               

                country TEXT NOT NULL,

                projectType TEXT NOT NULL,
                projectLocation TEXT NOT NULL,
                projectStatus TEXT NOT NULL,
                supervisionType TEXT NOT NULL,

                budget TEXT,
                description TEXT NOT NULL,
                fess INT,
                status TEXT DEFAULT 'request'
                    CHECK (status IN (
                        'request',
                        'approved',
                        'assigned',
                        'ongoing',
                        'completed',
                        'cancelled'
                    )),

                images TEXT[] DEFAULT '{}',
                after_images TEXT[] DEFAULT '{}',

                rating JSONB,
                useslug TEXT,

                contactMethod TEXT DEFAULT 'WhatsApp',

                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Supervisor table created successfully ✅");

    } catch (error) {
        console.error("Error creating supervisor table:", error);
    }
}

module.exports = createSupervisorDatabase;