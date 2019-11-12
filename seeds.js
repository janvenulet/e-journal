var mongoose = require("mongoose");
var Trip = require("./models/trip");
var Day = require("./models/day");
var fs = require('fs');

// var trip = [
//     {
//         title: "Brazil Christmas",
//         image: "https://www.pinetreesociety.org/wp-content/uploads/2017/10/cabins-960x600.jpg",
//         description: "One of the biggest campgrounds in the world"
//     },
//     {
//         title: "Roadtrip in Russia",
//         image: "https://miastodzieci.pl/wp-content/uploads/2019/03/campmazury_-osrodek-z-lotu-ptaka-2.jpg",
//         description: "One of the biggest campgrounds in the world"
//     },
//     {
//         title: "Following Napoleon: France-Germany-Austria",
//         image: "https://invinciblengo.org/photos/event/slider/manali-girls-special-adventure-camp-himachal-pradesh-1xJtgtx-1440x810.jpg",
//         description: "My favourite hero."
//     }
// ]

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