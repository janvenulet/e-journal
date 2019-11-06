var express = require("express");
var router = express.Router({mergeParams: true});
var Trip = require("../models/trip");
var Day = require("../models/day");

router.get("/new", isLoggedIn, (req,res) => {
        Trip.findById(req.params.id, (err, trip) => {
        if (err){
            console.log(err);
        } else {  
            res.render("days/new", {trip: trip});
        }
    });
});

router.post("/", isLoggedIn, (req,res) => {
    Trip.findById(req.params.id, (err, trip) => {
        if (err){
            console.log(err);
        } else {   
            Day.create(req.body.day, (err,day) => {
                if (err){
                    console.log(err);
                } else {  
                    day.author.id = req.user._id;
                    day.author.username = req.user.username; //wsadzamy dni do trip-a
                    trip.days.push(day);                      
                    trip.save();
                    day.save();
                    res.redirect("/trips/" + trip._id);
                }
            })
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login");
    }
};


module.exports = router; 