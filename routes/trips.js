var express = require("express");
var router = express.Router();
var Trip = require("../models/trip");
var User = require("../models/user");
var multer = require("multer");
var verifyToken = require('./verifyToken');
var uploadsPath = "\\Users\\Jan\\Documents\\Praca dyplomowa\\Projekt\\public\\uploads"; //tu może zamienić na './public/uploads'
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // tu wstawić login i tytuł tripa
    }
  });

router.use(express.static('./public'));
   
var upload = multer({ storage: storage })

router.get("/", (req,res) => {
    Trip.find({}, (err, trips) => {
        var images = [];
        if (err){
            console.log(err);
        } else {
            trips.forEach( (trip) => {
                images.push(`uploads/${trip.image}`);
                // console.log(__dirname + "\\uploads\\kkk.png");
                // res.sendFile(__dirname + "\\..\\uploads\\IMG_4717.JPG", (err) => {
                //     if (err) {
                //         console.log(err);
                //     }
                //     res.render("trips/index", {trips:trips});
                // });
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
        };
        res.render("trips/index", {trips:trips, images: images});
    });
});

router.get("/new", verifyToken,
 (req,res) => {
    res.render("trips/new.ejs");
    //var author = req.user._id;
    //console.log(author);
});

router.get("/:id", (req,res) => {
    Trip.findById(req.params.id).populate("days").populate("author").exec((err, trip) => {
            if (err){
                console.log(err);
            } else {
                res.render("trips/show", {trip: trip, image: `uploads/${trip.image}`});
            };
    });
});


router.post("/", upload.single('avatar'), verifyToken,
 (req, res, next) => {
    //console.log(req.file);
    var title = req.body.title;
    var description = req.body.description;
    var image = req.file.originalname; //tu path może zamienić
    User.findById(req.user._id, (err, author) => {
        //console.log(author._id);
        var newTrip = {title: title, description: description, image: image, author: author._id}
        console.log(newTrip);
        Trip.create(newTrip, (err,newlyCreated) => {
            if (err) {
                console.log(err);
            } else {
               //console.log(newlyCreated);
                res.redirect("/trips");
            };
        });
    });
});

router.get("/:id/edit", (req,res) => {
    Trip.findById(req.params.id).populate("day").exec( (err, foundTrip) => {
            if (err){    
                res.redirect("/trips");
                console.log(err);
            } else {
                res.render("trips/edit", {trip : foundTrip});
            };
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
