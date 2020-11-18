const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT)
.then(()=> console.log('Connected to MongoDB...'))
.catch(err => console.log('Could not connect to MongoDB...', err));

//middilewares
app.use(express.json());
//route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server Up and running on port ${port}`));