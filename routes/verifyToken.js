const jwt = require('jsonwebtoken');
require('dotenv').config();
var cookieParser = require("cookie-parser");

const auth = async (req, res, next) =>{ //middelwere function to routes
    //var cookies = req.cookies;//('access_token');//.replace('Bearer', '').trim();
    var token = req.cookies["token"];
    //console.log(token);
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET); 
        //console.log(verified);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid or expired token');
    };
};

module.exports = auth; 