var mongoose = require("mongoose");

var daySchema = mongoose.Schema({
    location: String,
    lat: Number,
    lng: Number,
    text: String,
    date: Date,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Day", daySchema);