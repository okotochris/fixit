const express = require('express');
require('dotenv').config();
const {createServer} = require('node:http');
const {Server} = require('socket.io')
const socketSetup = require('./socket/socket.js')
const db = require('./database/db.js')
const createUsersDatabase = require('./database/user.js');
const cors = require('cors');
const login = require('./routes/login.js');
pendingUsers = require('./database/isPending.js');
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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://resilient-cooperation-production.up.railway.app',
   process.env.ALLOW_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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


app.use('/api', login);
app.use('/api', updateRoutes);
app.use('/api', profileRoute)
app.use('/api', serviceRoute)
app.use('/api', jobRequest)

server.listen(PORT, async ()=>{
  console.log(`App listining in PORT ${PORT}`)
  await db.query('ALTER TABLE users ALTER COLUMN terms DROP NOT NULL;')
})

