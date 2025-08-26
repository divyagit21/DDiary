const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const moodTracker = require('./routes/moodTracker');
const userAuth = require('./routes/userAuth');
const journal = require('./routes/journal');
const task = require('./routes/tasks');
const env=require('dotenv');
const cookieParser = require('cookie-parser');
env.config()
const app = express();

mongoose.connect(process.env.MONGO_CONN)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: 'https://d-diary-fcna.vercel.app/', 
  credentials: true, 
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/moodTracker', moodTracker);
app.use('/api/user', userAuth);
app.use('/api/journal',journal);
app.use('/api/tasks',task);

app.listen(5000, () => console.log('node server running on port 5000'));
