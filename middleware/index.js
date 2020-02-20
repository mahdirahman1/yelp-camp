var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in to do that");
    res.redirect("/login");
};
 
middlewareObj.isAuthorizedComment = function(req, res, next){
    //check log in
    if(req.isAuthenticated()){
        //check if owner of comment
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });

    } else {
        res.redirect("back");
    }
}

middlewareObj.isAuthorizedCampground = function(req, res, next){
    //is logged in
    if(req.isAuthenticated()){
        //owns campground?
        Campground.findById(req.params.id, function(err, foundcampground){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundcampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                 } else{
                     res.redirect("back");
                 }
            }
        });
    } else {
        res.redirect("back");
    }
        
}


module.exports = middlewareObj