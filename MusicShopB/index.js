const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/user');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/user', userRoute);

module.exports = app;
