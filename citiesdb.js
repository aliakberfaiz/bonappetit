var mongoose=require("mongoose");
const indianCitiesDatabase = require('indian-cities-database');
 mongoose.connect("mongodb://aliakberfaiz:helloworld1@ds131983.mlab.com:31983/bonappetit",{ useNewUrlParser: true ,useMongoClient: true });
 
var cities = indianCitiesDatabase.cities;

indianCitiesDatabase.pushToDatabase("bonappetit", "cities", function(err,cities){
    if(err)
    console.log(err);
    else
    console.log(cities);
});