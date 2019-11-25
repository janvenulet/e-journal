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
            res.render("days/new", {trip: trip, currentUser: req.user});
        }
    }); 
});

router.get("/:idDay/edit", verifyToken, (req,res) => {
        var tripId = req.params.id;
        Day.findById(req.params.idDay, (err, day) => {
        if (err){
            console.log(err);
        } else {  
            res.render("days/edit", {day: day, tripId: tripId, currentUser: req.user});
        }
    });
});

// router.post("/:idDay", verifyToken, (req,res, next) => {
//     Day.findByIdAndUpdate(req.params.idDay, req.body.day, (err, updatedDay) => {
//         if (err){    
//             res.redirect("/trips");
//             console.log(err);
//         } else {
//             res.redirect("/trips/" + req.params.id);
//         };
//     });
// });

router.post("/:idDay", verifyToken, (req,res, next) => {
    var text = req.body.day.text;
    var date = req.body.day.date;
    var author = req.user._id;
    geocoder.geocode(req.body.day.location, (err, data) => {
       if (err || !data.length) {
            console.log(err);
            res.redirect("/trips"); // tu zrobić obsługę błędów
        }
        console.log(data);
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        Day.findByIdAndUpdate(req.params.idDay, {location:location, lat: lat, lng: lng, text:text, date: date}, (err,day) => {
            console.log(day);
            if (err){
                console.log(err);
            } else {
                res.redirect(`/trips/${req.params.id}`);
            };
        });
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
            geocoder.geocode(req.body.day.location, function (err, data) {
                if (err || !data.length) {  
                    console.log(err);  
                    return res.redirect('back'); //tego nie mam
                }
                var lat = data[0].latitude;
                var lng = data[0].longitude;
                var location = data[0].formattedAddress;
                Day.create({location:location, lat: lat, lng: lng, text: req.body.day.text, date: req.body.day.date}, (err,day) => {
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
            });
        };
    });
});

module.exports = router; 