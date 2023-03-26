const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const { readdirSync } = require('fs');
// routes
readdirSync('./routes').map((r) => app.use('/', require('./routes/' + r)));

// database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log('database connected successfully'))
  .catch((err) => console.log('error connecting to mongodb', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
