const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

// IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

dotenv.config();

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to DB');
});

// MIDDLEWARE
app.use(express.json());

// ROUTE MIDDLEWARES
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);


app.listen(3000, () => {
    console.log('Server Up and Running');
});
