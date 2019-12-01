var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    trips: [ 
        {
            type: mongoose.Schema.Types.ObjectId, //just embedding an ID 
            ref: "Trip" //Name of the model
        }
    ]
});

module.exports = mongoose.model("User", UserSchema);