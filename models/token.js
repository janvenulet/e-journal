var mongoose = require("mongoose");

var tokenSchema = mongoose.Schema({
    encodedToken: String
});

module.exports = mongoose.model("Token", tokenSchema);