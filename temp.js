var express     =   require("express"),
    app         =   express(),
    bodyParser  =   require("body-parser"),
    mongoose    =   require("mongoose"),
    request     =   require("request"),
    decode      =   require('unescape'),
    ent         =   require('ent'),
    encode      =   require('ent/encode'),
    decode      =   require('ent/decode'),
    flash       = require("connect-flash"),
     
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
   
    citySchema  =   require("./models/city"),
    Review  =   require("./models/review"),
    User        =   require("./models/user");
    app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/bonapp_db",{useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public/'));
 app.use(methodOverride("_method"));
 app.use(flash());
   
    Review.find({},function(err,result){
        if(err)
        console.log(err);
        else
        console.log(result);
    }
);