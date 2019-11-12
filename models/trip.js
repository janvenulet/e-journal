var mongoose = require("mongoose");

var tripSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    author: {
 //       id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
//       },
//        username: String
    },
    days : [ 
        {
            type: mongoose.Schema.Types.ObjectId, //just embedding an ID 
            ref: "Day" //Name of the model
        }
    ],
});

module.exports = mongoose.model("Trip", tripSchema);