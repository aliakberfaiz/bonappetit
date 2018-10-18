var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
   title: String,
   cityName: String,
   stateName:String,
   image: String,
   description: String,
   address:String,
   price:String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("review", reviewSchema);