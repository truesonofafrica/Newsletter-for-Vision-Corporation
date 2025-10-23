require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const newsletterRoute = require('./routes/newsletterRoute');
app.use(express.json());

app.use('/api/v1/newsletter', newsletterRoute);

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
