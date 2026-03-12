async function skill(){
    const db = require('./db')
    try {
         db.query(`
            CREATE TABLE IF NOT EXISTS skill(
            id SERIAL PRIMARY KEY,
            skill TEXT
        )
        `)
        console.log("Skill table created ✅")
    } catch (error) {
        console.log(error.message)
    }

}

module.exports = skill;