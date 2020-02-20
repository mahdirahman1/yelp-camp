require('dotenv').config();
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash');
    localStrategy = require('passport-local'),
    methodOverride = require('method-override');
    passportLocalMongoose = require('passport-local-mongoose'),
    seedsDB = require("./seeds"),
    Campground = require("./models/campground"),
    User = require("./models/user"),
    Comment = require("./models/comment");

//REQUIRING ROUTES
var authRoutes = require("./routes/auth");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");

mongoose.connect('mongodb+srv://mahdi:Shakib@75@cluster0-cpgfn.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.locals.moment = require('moment');
app.use(express.static('public'));

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "test",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//function for hiding navbar login/signup/logout
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(methodOverride("_method"));


//ROUTES CONFIG
app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

//generated data
// seedsDB();






//PORT CONFIG
app.listen(process.env.PORT || 1000, function(){
    console.log("YelpCamp started ...");
 });