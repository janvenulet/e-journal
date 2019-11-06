var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var Trip = require("./models/trip");
var Comment = require("./models/day.js");
var User = require("./models/user.js");
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments");
var tripRoutes = require("./routes/trips");
var authRoutes = require("./routes/index");

const PORT = 8092;
const mongoURI = "mongodb://localhost:27017/e-journal";

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.set(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set(methodOverride('_method'));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Some seed!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/trips/:id/days",commentRoutes);
app.use("/trips", tripRoutes); //all routes should start with /trips
app.use(authRoutes);

app.listen(PORT, () => {
    console.log("E-Journal server listening on port " + PORT);
});