const jwt = require('jsonwebtoken');
require('dotenv').config();
var cookieParser = require("cookie-parser");
var Token = require("../models/token");

const auth = async (req, res, next) =>{ //middelwere function to routes
    //var cookies = req.cookies;//('access_token');//.replace('Bearer', '').trim();
    var token = req.cookies["token"];
    if (!token) return res.redirect("/login");
    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        let tokenWhiteListed = await Token.findOne( {encodedToken: token}, (error, foundToken) => {
            if (error) {
                console.log(err);
            };
        });
        console.log("Hejjjjj" + tokenWhiteListed);
        if (!tokenWhiteListed) { 
            throw new Error("Token removed from whitelist");
        } else {    
            req.user = verified;
            next();
        }
    } catch (err) {
        console.log(err);
        res.redirect("/login");
    };
};

module.exports = auth; 