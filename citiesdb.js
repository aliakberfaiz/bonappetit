var mongoose=require("mongoose");
const indianCitiesDatabase = require('indian-cities-database');
mongoose.connect("mongodb://aliakberfaiz:helloworld1@ds131983.mlab.com:31983/bonappetit",{ useNewUrlParser: true ,useMongoClient: true });
// mongoose.connect("mongodb://aliakberfaiz:helloworld1@ds131983.mlab.com:31983/bonappetit",{useNewUrlParser: true });
var hello = indianCitiesDatabase.cities;

indianCitiesDatabase.pushToDatabase("bonappetit", "cities", function(err,hello){
    if(err)
    console.log(err);
    else
    console.log(hello);
});