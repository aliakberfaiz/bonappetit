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
    Comment  =   require("./models/comment"),
    User        =   require("./models/user"),
     middleware = require("./middleware/index");


        
app.use(bodyParser.urlencoded({extended: true}));
//mongoose.connect("mongodb://localhost:27017/bonapp_db",{useNewUrlParser: true });
mongoose.connect("mongodb://aliakberfaiz:helloworld1@ds131983.mlab.com:31983/bonappetit",{useNewUrlParser: true });
//  "
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public/'));
 app.use(methodOverride("_method"));
 app.use(flash());
var statesGlobal=[],
    citiesGlobal=[],
    selectedCity=false,
    selectedState=false;
 

 //Modeling
var Cities  =   mongoose.model("cities",citySchema);


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello Awesome Ali Akber",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//citiesTesting

/*app.get("/", function(req, res){
    // Get all states from DB
    Cities.distinct("stateName",{},
        (
            
            function(err, states){
       if(err){
           console.log(err);
       } else {
           console.log(states);
           //var cities=[{name: 'Raipur'},{name:'Amalner'}];
          res.render("citiesList",{states:states});
       }
    }
    )
    
    
    
    
    );

    
    
    
});



  */  




app.get("/",function(req,res){
    
    // 
res.render("home");
});

// show signup form
app.get("/signup", function(req, res){
   res.render("signup"); 
});
//signup
app.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("Welcome to BonAppetit"+user.username);
           req.flash("success", "Welcome to BonAppetit " + user.username);
           res.redirect("/reviews"); 
        });
    });
});

//login page 
app.get("/login",function(req,res){
    
    // 
res.render("login");
});
//login post
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/reviews",
        failureRedirect: "/login"
    }), function(req, res){
});
app.get("/logout", function(req, res){
   req.logout();
   console.log("logged out");
   req.flash("success", "Logged you out!");
   res.redirect("/reviews");
});


//api food
app.get("/recipes",function(req,res){
    var url="http://food2fork.com/api/search?key=7f7e05562f8d994918ee30c9d779149d";
    request(url, function(error,response,body){
        if(!error && response.statusCode==200){
          //console.log(decode('&#8217;'));
            var parsedData=JSON.parse(decode(body));
            var recipes=parsedData["recipes"];
    
       res.render("recipes",{recipes:recipes});
    
        }
    })
    //
    
    
});
app.get("/search",function(req,res){
     var search=req.query.searchKey;
    var url="http://food2fork.com/api/search?key=7f7e05562f8d994918ee30c9d779149d&q="+search;
    request(url, function(error,response,body){
        if(!error && response.statusCode==200){
            var parsedData=JSON.parse(decode(body));
            var recipes=parsedData["recipes"];
       res.render("search",{recipes:recipes});
        }
    
})
    
});

//review rendering nothing is selected
app.get("/reviews",function(req,res){
     Cities.distinct("stateName",{},
        (
            
            function(err, states){
       if(err){
           console.log(err);
       } else {
           console.log(states);
          statesGlobal=states;
           //var cities=[{name: 'Raipur'},{name:'Amalner'}];
          res.render("reviews",{states:states,cities:false,selectedState:false,selectedCity:false});
       }
    }
    )
    
    
    
    
    );

    
 //review rendering when state is selected 
    
});
app.post("/reviews",function(req,res){
   var stateSelected=req.body.state;
   //console.log(req);
   res.redirect("/reviews/"+stateSelected);
});
app.get("/reviews/new/",isLoggedIn,function(req, res) {
        Cities.distinct("stateName",{},
        (
            
            function(err, states){
       if(err){
           console.log(err);
       } else {
          // console.log(states);
          statesGlobal=states;
           //var cities=[{name: 'Raipur'},{name:'Amalner'}];
          res.render("new",{states:states,cities:false,selectedState:false,selectedCity:false});
       }
    }
    )
    
    
    
    
    );
});
app.get("/reviews/new/:state",isLoggedIn,function(req, res) {
       Cities.find({stateName:req.params.state},
   function(err,result){
       if(err)
       res.render("back");
       else
       {
           citiesGlobal=result;
           //console.log(citiesGlobal);
       //console.log(result);
       res.render("new",{cities:result,states:statesGlobal,selectedState:req.params.state,selectedCity:false});
       }
   // 
}
       
       )
});
app.post("/reviews/search",function(req,res){
   var city=req.body.city;
   var state=req.body.state;
   Review.find({stateName:state,cityName:city},function(err,reviews){
       if(err)
       console.log(err);
       else{
           res.render("reviewshow",{reviews:reviews});
       }
   })
});
app.get("/review/:id",function(req, res) {
  Review.findById(req.params.id).populate("comments").exec(function(err, foundReview){
        if(err){
            console.log(err);
        } else {
            console.log(foundReview);
            //render show template with that campground
            res.render("detailedreview", {review: foundReview});
        }
    }); 
});

// continue of state cities 
app.get("/reviews/:state",function(req, res) {
    //console.log(req.params.state);
   Cities.find({stateName:req.params.state},
   function(err,result){
       if(err)
       res.render("back");
       else
       {
           citiesGlobal=result;
           //console.log(citiesGlobal);
       //console.log(result);
       res.render("reviews",{cities:result,states:statesGlobal,selectedState:req.params.state,selectedCity:false});
       }
   // 
}
       
       )
       
   });
app.post("/reviews/new",isLoggedIn,function(req,res){
    //console.log(req.body);
    var state=req.body.state;
    var city=req.body.city;
    var title=req.body.title;
    var image=req.body.image;
    var price=req.body.price;
    var description=req.body.desc;
    var address=req.body.address;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newReview={ title: title,
   cityName: city,
   stateName:state,
   image: image,
   description: description,
   address:address,
   price:price,
   author:author};
   Review.create(newReview,function(err,newlycreated){
       if(err)
       console.log(err);
       else{
           console.log(newlycreated);
           res.redirect("/reviews/");
       }
       
       
   });
});
app.get("/reviews/:id/edit", middleware.checkReviewOwnership , function(req, res){
    Review.findById(req.params.id, function(err, foundReview){
        if(err)
        console.log(err)
        
        else{
             Cities.find({stateName:foundReview.stateName},
   function(err,result){
       if(err)
       res.render("back");
       else
       {
           citiesGlobal=result;
           //console.log(citiesGlobal);
       //console.log(result);
       console.log(foundReview.cityName);
       console.log(foundReview.stateName);
       console.log(statesGlobal);
       res.render("edit",{cities:result,states:statesGlobal,selectedState:foundReview.stateName,selectedCity:foundReview.cityName,review:foundReview});
       }
   // 
}
       
       )
        }
    });
});

app.put("/reviewsedit/:id",middleware.checkReviewOwnership, function(req, res){
    // find and update the correct campground
    Review.findByIdAndUpdate(req.params.id, req.body.review, function(err, review){
       if(err){
           res.redirect("/reviews");
       } else {
           //redirect somewhere(show page)
           res.redirect("/review/" + req.params.id);
       }
    });
});
app.post("/commentadd/:id",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
  // console.log(req.body.comment);
   
   Review.findById(req.params.id, function(err, foundReview){
       if(err){
           console.log(err);
           res.redirect("/reviews");
       } else {
           //console.log("Hello World");
           //console.log(foundReview);
             Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //console.log(comment);
               //save comment
               comment.save();
              foundReview.comments.push(comment);
               foundReview.save();
              // console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/review/'+req.params.id);
           }
        });
       }
   });
});
app.delete("/deletingcommentsof/:rid/deleteComments/:comment_id" , checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    
    console.log(req.params.comment_id);
    console.log(req.params.rid);
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/review/"+req.params.rid);
       }
    });
});
app.delete("/reviewdeleting/:id",middleware.checkReviewOwnership, function(req, res){
   Review.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/reviews");
      } else {
          req.flash("success", "review deleted");
          res.redirect("/reviews");
      }
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("BonAppetite app has started");
});

function checkReviewOwnership (req, res, next) {
 if(req.isAuthenticated()){
        Review.findById(req.params.id, function(err, foundReview){
           if(err){
               req.flash("error", "Review");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundReview.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}
function checkCommentOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}
