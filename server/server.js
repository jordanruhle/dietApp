const express = require('express');
require('dotenv').config()
const app = express();
var bodyParser = require('body-parser');
const multer  = require('multer');
const { resolve } = require("path");
const port = 8000;
const DB = "dietApp"
const cors = require('cors')
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


// middleware
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json(), express.urlencoded({extended:true}));
app.use(express.static(process.env.STATIC_DIR));


// Connect to the DB using mongoose
require("./config/mongoose.config")(DB)

// modularize routes
// require("./routes/Food.routes")(app)
// require("./routes/Meal.routes")(app)
require("./routes/User.routes")(app)


app.listen(port, () => console.log(`Listening on port: ${port}`) );