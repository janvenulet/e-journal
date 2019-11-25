var mongoose = require("mongoose");
var Trip = require("./models/trip");
var Day = require("./models/day");
var fs = require('fs');

function seedDB() {
    Day.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed days!");
        }
    });
    Trip.find( {}, (err,trips) => {
        trips.forEach(trip => {
            fs.unlink(`public/uploads/${trip.image}`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
        });
        console.log("Files removed");
    });
    Trip.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed trips!");
            // trip.forEach((seed) => {
            //     Trip.create(seed, (err, trip) =>{
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log("Added a trip!");
            //             // Day.create(
            //             //     {
            //             //         text: "This is amazing place!",
            //             //         author: {
            //             //             username: "Frank Underwood"
            //             //         }
            //             //     }, (err, day) =>
            //             //     {
            //             //         if (err) {
            //             //             console.log(err);
            //             //         } else {
            //             //             trip.days.push(day); //bit of change
            //             //             trip.save();
            //             //             console.log("Created new day!");
            //             //         };
            //             //     });
            //         }; 
            //     });
            // });
        };
    });
};

module.exports = seedDB;