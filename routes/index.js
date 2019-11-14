var express = require("express");
//var passport = require("passport");
var router = express.Router();
var User = require("../models/user");
var {registerValidation, loginValidation} = require('../validation');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get("/", (req,res) => {
    var error = [], success = [];
    res.render("landing", {error: error, success: success });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    //Validation of Data
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Checking if user already in db
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send("Email already exists");
    
    //HASH PASSWORDS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE NEW USER
    const user = new User ({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    }); 
    try {
        const savedUser = await user.save();
        console.log(savedUser);
        res.redirect("/trips");
    } catch (err) {
        res.status(400).send(err);
    }
    
    // User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    //     if (err){
    //         console.log(err);
    //         res.render("login");
    //     } else { 
    //         passport.authenticate("local")(req, res, () => {
    //             res.redirect("/campgrounds");
    //         }); 
    //     }
    // });
});

router.post("/login", async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //CHECK IF USER IN DB
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send("Email don't have any assigned account to it");
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');
    //CREATE AND ASSING TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '30m' });
    console.log(token);
    res.set('Authentication', token);
    var trips = [];
    console.log(res.header.toString);
    //res.cookie("access_token", 'Bearer ' + token);
    res.cookie("token", token);
    res.status(500);
    //res.render("trips/index", {trips: trips});
    res.redirect(301, "/trips");
});

router.get("/login", (req, res) => {
    res.render("login");
});

// router.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login"
//     }), (req, res) => {
// });

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/trips");
});

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()){
//         next();
//     } else {
//         res.redirect("/login");
//     }
// };


module.exports = router; 