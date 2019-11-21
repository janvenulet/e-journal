var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Token = require("../models/token");
var {registerValidation, loginValidation} = require('../validation');
var checkIfLoggedIn = require('./checkStatus');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var cookieParser = require("cookie-parser");
require('dotenv').config();
router.use(express.static('./public'));

router.get("/", async (req,res) => {
    var error = [], success = [];
    var user = null;
    if (req.cookies["token"]) {
        try {
            const verified = await jwt.verify(req.cookies["token"], process.env.TOKEN_SECRET);
            await Token.findOne( {encodedToken: req.cookies["token"]}, (error, foundToken) => {
                if (error) {
                    console.log(error);
                }; 
                if (foundToken) {
                    user = verified;
                }
                console.log("Inside " + foundToken);
            });
        } catch (err) {
            console.log(err);
        };
    };
    console.log(user);
    res.render("landing", {error: error, success: success, currentUser: user});
});

router.get("/register", checkIfLoggedIn, (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    if (req.user != null) redirect("/trips");
    //Validation of Data
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Checking if user already in db
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send("Email already exists");

    const usernameExists = await User.findOne({username: req.body.username});
    if (usernameExists) return res.status(400).send("Username is already asssigned to another account");
    
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
        res.redirect("/login");
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
    if (req.user != null) redirect("/trips");
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //CHECK IF USER IN DB
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send("Email don't have any assigned account to it");
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');
    //CREATE AND ASSING TOKEN
    const token = jwt.sign({_id: user._id, username: user.username}, process.env.TOKEN_SECRET, { expiresIn: '15m' });
    console.log(token);
    res.set('Authentication', token);
    var trips = [];
    console.log(res.header.toString);
    var issuedToken = {encodedToken: token};
    //res.cookie("access_token", 'Bearer ' + token);
    res.cookie("token", token);
    Token.create(issuedToken, (err, newToken) => {
        if (err) {
            console.log(err);
        }
    });
    res.status(500);
    //res.render("trips/index", {trips: trips});
    res.redirect(301, "/trips");
});

router.get("/login", checkIfLoggedIn, (req, res) => {
    res.render("login");
});

// router.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login"
//     }), (req, res) => {
// });

router.get("/logout", (req, res) => {
    Token.findOneAndRemove({encodedToken: req.cookies["token"]}, (err, removedToken) => {
        if (err) {
            return res.status(400).send(error.details[0].message);
        }
        res.redirect("/");
    });
});

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()){
//         next();
//     } else {
//         res.redirect("/login");
//     }
// };


module.exports = router; 