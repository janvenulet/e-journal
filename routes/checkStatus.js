const jwt = require('jsonwebtoken');
require('dotenv').config();
var cookieParser = require("cookie-parser");
var Token = require("../models/token");

const checkIfLoggedOut = async (req, res, next) => {
    var token = req.cookies["token"];
    if (!token) {
        next();
    } else {
        try {
            const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
            let tokenWhiteListed = await Token.findOne( {encodedToken: token}, (error, foundToken) => {
                if (error) {
                    console.log(err);
                };
            });
            if (tokenWhiteListed) {
                res.redirect("/trips");
            } else {
                next();
            }
        } catch (err) {
            console.log(err);
            next();
        };
    }
};


module.exports = checkIfLoggedOut;