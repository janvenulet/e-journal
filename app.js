require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var flash = require("connect-flash");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");

var Trip = require("./models/trip");
var Day = require("./models/day.js");
var User = require("./models/user.js");
var seedDB = require("./seeds");

var dayRoutes = require("./routes/days");
var tripRoutes = require("./routes/trips");
var authRoutes = require("./routes/index");

const PORT = process.env.PORT ||8092;
const mongoURI = "mongodb://localhost:27017/e-journal";
const mongoURIRemote = "mongodb+srv://janven:"+ process.env.ATLAS_PASSWORD +"@cluster0-v8grk.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongoURIRemote, {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.set(express.static(__dirname + "./public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/trips/:id/days", dayRoutes);
app.use("/trips", tripRoutes);
app.use(authRoutes);

app.listen(PORT, () => {
    console.log("E-Journal server listening on port " + PORT);
});