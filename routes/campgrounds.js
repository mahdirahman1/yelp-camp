var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//CAMPGROUND ROUTES
router.get("/",  function(req, res){
    res.render('landing');
});

//INDEX ROUTE
router.get("/campgrounds", function(req,res){
   //get all campgrounds from DB
   Campground.find({}, function(err, allcampgrounds){
       if(err){
           req.flash("error", "Something went wrong");
       } else{
        res.render('campgrounds/index', {campgrounds: allcampgrounds});
       }
   }) 
});

//NEW ROUTE - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render('campgrounds/new');
});
 
//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        console.log(err);
        return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name,price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              res.redirect("/campgrounds");
          }
      });
    });
  });

//SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req,res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            req.flash("error", "Something went wrong!");
        } else{
            res.render("campgrounds/show", {campground: foundcamp});
        }
    });
});

//EDIT CAMPGROUND
router.get("/campgrounds/:id/edit", middleware.isAuthorizedCampground, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    })
});



// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.isAuthorizedCampground, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });

//DELETE CAMPGROUND
router.delete("/campgrounds/:id", middleware.isAuthorizedCampground, function(req,res){
    Campground.findByIdAndDelete(req.params.id, function(err, deleted){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Campground was deleted");
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;