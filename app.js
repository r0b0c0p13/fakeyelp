var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
    

var commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    //

    //
    //mongodb+srv://user:<password>@cluster0-4p55w.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://user:mongodbuser@cluster0-4p55w.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();//seed the database

//passport configuration
app.use(require("express-session")({
    secret:"Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);
 const port = process.env.PORT || 3000;

 
app.listen(port,process.env.IP,function(){
   console.log("Server Stared!!!"); 
});