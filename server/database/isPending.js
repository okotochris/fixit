function pendingUsers() {
  const db = require('./db.js');
  try{
    db.query(`
       CREATE TABLE IF NOT EXISTS pending_users (
        code TEXT,
        email TEXT,
        userinfo JSONB
       )
    `)
    console.log('pending_users table created✅');
  }
  catch(error){
    console.log(error.message);
  };
  
}
module.exports = pendingUsers;