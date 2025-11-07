require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors());

const newsletterRoute = require('./routes/newsletterRoute');
const uptimeRobotRoute = require('./routes/uptimeRobotRoute');
const contactUsRoute = require('./routes/contactUsRoute');

app.use(express.json());

app.use('/api/v1/newsletter', newsletterRoute);
app.use('/api/v1/uptime-robot', uptimeRobotRoute);
app.use('/api/v1/contact-us', contactUsRoute);

app.all('*splat', (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const DB = process.env.MONGO_URL.replace(
    '<<Password>>',
    process.env.MONGO_PASSWORD
  );
  try {
    await mongoose.connect(DB).then(() => console.log('Database connected'));
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
