const express = require('express');
require('dotenv').config();
const {createServer} = require('node:http');
const {Server} = require('socket.io')
const socketSetup = require('./socket/socket.js')
const db = require('./database/db.js')
const createUsersDatabase = require('./database/user.js');
const cors = require('cors');
const athenticatRoute = require('./routes/authenticatRoute.js');
const pendingUsers = require('./database/isPending.js');
const updateRoutes = require('./routes/updateRoutes.js');
const skill = require('./database/skill.js')
const createJobTable = require('./database/job.js')
const createReviewTable = require('./database/review.js')
const profileRoute = require('./routes/profileRoute.js')
const serviceRoute = require('./routes/serviceRoute.js')
const jobRequest = require('./routes/requestJobRoute.js')


const app = express();
const server = createServer(app);


app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//SETTING MIDDLEWARE
const io = new Server(server, {
  cors:{
    origin:"http://localhost:3000",
    methods:['GET', 'POST']
  }
});
//CONNECTION TO DATABASE
db.connect().then(result=>{
  console.log("Database connected successfully")
  createUsersDatabase()
  pendingUsers()
  skill()
  createJobTable()
  createReviewTable()
})
.catch(error=>{
  console.log("Database connection failed", error.message)
})
const PORT = process.env.PORT || 8080;
socketSetup(io);


app.use('/api', athenticatRoute);
app.use('/api', updateRoutes);
app.use('/api', profileRoute)
app.use('/api', serviceRoute)
app.use('/api', jobRequest)

//SEND EMAIL TO USER THAT HAS NOT SET LOCATION 
const cron = require('node-cron');
const sendEmail = require('./service/brevo.js');

// runs every day at 8am
// cron.schedule("0 9 * * 1", async () => {
//   try {
//     console.log("Running daily location check job...");

//     const result = await db.query(`
//       SELECT email, id
//       FROM users
//       WHERE latitude = 0 AND longitude = 0
//     `);

//     const users = result.rows;

//     for (const user of users) {
//       const link = `https://servicehub.space/update_location`;

//       const html = `
//         <div style="font-family: Arial, sans-serif;">
//           <h2>📍 Update Your Location</h2>

//           <p>
//             We noticed your location is missing or incomplete.
//             Please update it so we can match you with nearby jobs and workers.
//           </p>

//           <p>
//             This helps improve job accuracy and visibility in your area.
//           </p>

//           <a href="${link}"
//              style="display:inline-block;padding:10px 15px;
//              background:#f97316;color:white;text-decoration:none;
//              border-radius:6px;">
//             Update Location
//           </a>

//           <p style="margin-top:20px;font-size:12px;color:#666;">
//             If you did not sign up for ServiceHub, you can ignore this email.
//           </p>
//         </div>
//       `;

//       await sendEmail(user.email, html);
//     }

//     console.log(`Sent ${users.length} location emails`);
//   } catch (err) {
//     console.error("Location cron job failed:", err);
//   }
// });

server.listen(PORT, async ()=>{
  console.log(`App listining in PORT ${PORT}`)
 
})

