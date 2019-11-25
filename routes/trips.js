var express = require("express");
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId; 
var Trip = require("../models/trip");
var Day = require("../models/day");
var User = require("../models/user");
var multer = require("multer");
var path = require("path");
var verifyToken = require('./verifyToken');
var uploadsPath = "\\Users\\Jan\\Documents\\Praca dyplomowa\\Projekt\\public\\uploads"; //tu może zamienić na './public/uploads'
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // tu wstawić login i tytuł tripa
    },
});

var fileFilter= (req, file, cb) => {
    var ext = path.extname(file.originalname);
    ext = ext.toLowerCase();
    console.log(ext);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            console.log("Only images are allowed");
            return cb(new Error('Only images format files are allowed'));
        }
    cb(null, true);
};

router.use(express.static('./public'));
   
var upload = multer({ storage: storage, fileFilter: fileFilter});
router.get("/", verifyToken, (req,res) => {
    User.findById(req.user._id).populate("trips").exec((err, user) => {
        if (err){
            console.log(err);
        } else {
            var trips = user.trips;
            var images = [];
            trips.forEach( (trip) => {
                images.push(`uploads/${trip.image}`);
            });
            res.render("trips/index", {trips:trips, images: images, currentUser: user});
        }
    });
});

router.get("/new", verifyToken, (req,res) => {
    res.render("trips/new.ejs", {currentUser: req.user});
    //var author = req.user._id;
    //console.log(author);
});

router.get("/:id", verifyToken, (req,res) => {
    Trip.findById(req.params.id).populate({path:"days"}).populate("author").exec((err, trip) => {
            if (err){
                console.log(err);
            } else {
                var days = trip.days;
                days.sort( (o1, o2) => {
                    return new Date(o1.date) - new Date(o2.date);
                });
                res.render("trips/show", {trip: trip, image: `uploads/${trip.image}`, days:days, currentUser: req.user});
            };
    });
});


router.post("/", verifyToken,
 (req, res, next) => {
    upload.single('avatar')(req,res, (err) => {
        if (err) {
            res.render("trips/new", {currentUser: req.user, error: err.toString()} );
        } else {
            var title = req.body.title;
            var description = req.body.description;
            var image = req.file.originalname; //tu path może zamienić
            User.findById(req.user._id, (err, author) => {
                //console.log(author._id);
                var newTrip = {title: title, description: description, image: image, author: author._id}
                //console.log(newTrip);
                Trip.create(newTrip, (err,newlyCreated) => {
                    if (err) {
                        console.log(err);
                    } else {
                        author.trips.push(newlyCreated);
                        author.save();
                       //console.log(newlyCreated);
                        res.redirect("/trips");
                    };
                });
            });
        };
    });
});

router.get("/:id/edit", verifyToken, (req,res) => {
    Trip.findById(req.params.id).populate("day").exec( (err, foundTrip) => {
            if (err){    
                res.redirect("/trips");
                console.log(err);
            } else {
                console.log(foundTrip);
                res.render("trips/edit", {trip : foundTrip, currentUser: req.user});//, image: `uploads/${foundTrip.image}`});
            };
    });
});

router.post("/:id", upload.single('avatar'), verifyToken, (req,res, next) => {
    if (req.body.trip["image"] == null) {
        Trip.findByIdAndUpdate(req.params.id, {$set: {title: req.body.trip["title"], description: req.body.trip["description"]}}, (err, updatedTrip) => {
            if (err){    
                res.redirect("/trips");
                console.log(err);
            } else {
                res.redirect("/trips/" + req.params.id);
            };
        });
    } else {
        req.body.trip["image"] = req.file.originalname;
        Trip.findByIdAndUpdate(req.params.id, req.body.trip, (err, updatedTrip) => {
            if (err){    
                res.redirect("/trips");
                console.log(err);
            } else {
                res.redirect("/trips/" + req.params.id);
            };
        });
    }
});

router.post("/:id/delete", verifyToken, (req,res, next) => { //To mogę jeszcze zooptymalizować
    // Day.deleteOne({ author: { id: req.params.id}}, (err) => {
    //     if (err){    
    //         res.redirect("/trips");
    //         console.log(err);
    //     } else {
    //         console.log("Deleted one");
    //         // trip.days.forEach((day) => {
    //         //     Day
    //         // });
    //         res.redirect("/trips");
    //     }
        
    // });
    Trip.findById(req.params.id).populate("days").exec((err, trip) => {
        if (err){    
            res.redirect(`/trips/${req.params.id}`);
            console.log(err);
        } else {
            trip.days.forEach((day) => {
                Day.findByIdAndRemove(day._id, (err) => {
                    if (err){    
                        res.redirect(`/trips/${req.params.id}`);
                        console.log(err);
                    }
                });
            });
            User.findByIdAndUpdate(trip.author.valueOf(), {$pull: {trips: new ObjectId(trip._id)}}, (err, updatedUser) => {
                console.log(updatedUser);    
            });
            User.findById(trip.author.valueOf(), (err, updatedUser) => {
                console.log(updatedUser);    
            });
            console.log(trip.author.valueOf());
            Trip.findByIdAndDelete(trip._id, (err) => {
                if (err){    
                    res.redirect(`/trips/${trip._id}`);
                    console.log(err);
                };
                res.redirect("/trips");
            });
        };
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login");
    }
};

function isAuthenticated(trip, user) {
    if (trip.author == user._id) {
        return true
    } else {
        return false;
    }
}

module.exports = router; 
