var express = require("express");
var router = express.Router({mergeParams: true});
var Trip = require("../models/trip");
var Day = require("../models/day");
var verifyToken = require('./verifyToken');
var ObjectId = require('mongoose').Types.ObjectId;
var NodeGeocoder = require('node-geocoder');
 
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
   
  var geocoder = NodeGeocoder(options);

router.get("/new", verifyToken, (req,res) => {
        Trip.findById(req.params.id, (err, trip) => {
        if (err){
            console.log(err);
        } else {  
            res.render("days/new", {trip: trip});
        }
    });
});

router.get("/:idDay/edit", verifyToken, (req,res) => {
        var tripId = req.params.id;
        Day.findById(req.params.idDay, (err, day) => {
        if (err){
            console.log(err);
        } else {  
            res.render("days/edit", {day: day, tripId: tripId});
        }
    });
});

router.post("/:idDay", verifyToken, (req,res, next) => {
    Day.findByIdAndUpdate(req.params.idDay, req.body.day, (err, updatedDay) => {
        if (err){    
            res.redirect("/trips");
            console.log(err);
        } else {
            res.redirect("/trips/" + req.params.id);
        };
    });
});

router.post("/:idDay/delete", verifyToken, async (req,res, next) => {
    Day.findByIdAndDelete(req.params.idDay, async (err, day) => {
        if (err){    
            res.redirect(`/trips/${req.params.id}`);
            console.log(err);
        } else {
            console.log(day._id);
            await Trip.findByIdAndUpdate(req.params.id, {$pull: {days: new ObjectId(day._id)}}, (err, trip) => {  
                if (err){
                    console.log(err);
                };
                res.redirect(`/trips/${trip._id}`);
            });
        };
    });
});


router.post("/", verifyToken, (req,res) => {
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
                };
            });
        };
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