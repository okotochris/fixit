const pg = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const db = isProduction 
? new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false,
    }
})
: new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'fixdatabase',
    password: 'Rexwhite.10',
    port: 5432
})

module.exports = db;