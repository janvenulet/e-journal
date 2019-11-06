var express = require("express");
var router = express.Router();
var Trip = require("../models/trip");
var multer = require("multer");
var uploadsPath = "\\Users\\Jan\\Documents\\Praca dyplomowa\\Projekt\\uploads";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // tu wstawić login i tytuł tripa
    }
  });
   
var upload = multer({ storage: storage })

router.get("/", (req,res) => {
    Trip.find({}, (err, trips) => {
        if (err){
            console.log(err);
        } else {
            trips.forEach( (trip) => {
                res.sendFile("\\Users\\Jan\\Pictures\\kkk.png");
                // var options = {
                //     root: __dirname + 'uploads',
                //     dotfiles: 'deny',
                //     headers: {
                //       'x-timestamp': Date.now(),
                //       'x-sent': true
                //     }
                //   }
                // let image = trip.image;
                // res.sendFile("kkk.png", options, (err) => {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log('Sent:', image)
                //     }
                // });
            });
            res.render("trips/index", {trips:trips});
        }
    });
});

router.get("/new", //isLoggedIn,
 (req,res) => {
    res.render("trips/new.ejs");
});

router.get("/:id", (req,res) => {
    Trip.findById(req.params.id).populate("day").exec( (err, foundTrip) => {
            if (err){
                console.log(err);
            } else {
                res.render("trips/show", {trip : foundTrip});
            }
    });
})


router.post("/", upload.single('avatar'), // isLoggedIn,
 (req, res, next) => {
    console.log(req.file);
    var title = req.body.title;
    var description = req.body.description;
    var image = req.file.path;
    var newTrip = {title: title, description: description, image: image}
    Trip.create(newTrip, (err,newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/trips");
        };
    });
});

router.get("/:id/edit", (req,res) => {
    Trip.findById(req.params.id).populate("day").exec( (err, foundTrip) => {
            if (err){    
                res.redirect("/trips");
                console.log(err);
            } else {
                res.render("trips/edit", {trip : foundTrip});
            }
    });
});

router.post("/:id", (req,res) => {
    Trip.findByIdAndUpdate(req.params.id, req.body.trip, (err, updatedTrip) => {
        if (err){    
            res.redirect("/trips");
            console.log(err);
        } else {
            res.redirect("/trips/" + req.params.id);
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

//<form method="POST" action="/campgrounds/<%= campground._id %>?_method=PUT">