const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
require('./db/db-conn.js');
const cors = require('cors');
var cookieParser = require('cookie-parser');

// Variables
const app = express();
const port = process.env.PORT;

// CORS issue
app.use(cors({ credentials: true, origin: true }))
// Middleware
app.use(express.json());
app.use(cookieParser());
// link routes 
app.use(require('./routes/auth'));

app.listen(port, () => {
    console.log(`server is running at port# ${port}.....`);
})