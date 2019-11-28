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
        };
    });
};

module.exports = seedDB;