var express = require("express");
//var passport = require("passport");
var router = express.Router();
var User = require("../models/user");
const Joi = require('@hapi/joi')

const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

router.get("/", (req,res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});


router.post("/register", async (req, res) => {
    //Validation of Data
    const {error}  = schema.validate(req.body); //this returns an object
    if (error) return res.status(400).send(error.details[0].message);
    const user = new User ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
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
    res.redirect("/campgrounds");
});

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()){
//         next();
//     } else {
//         res.redirect("/login");
//     }
// };


module.exports = router; 