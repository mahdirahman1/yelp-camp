var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//============================================COMMENTS============
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            req.flash("error", "Something went wrong")
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err){
            req.flash("error", "Something went wrong");
        } else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    foundcamp.comments.push(comment);
                    foundcamp.save();
                    res.redirect("/campgrounds/"+foundcamp._id);
                }
            });
        }
    });
});

//Comments Edit
router.get("/campgrounds/:id/comments/:comment_id/edit",  middleware.isAuthorizedComment, function(req,res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});


//Comments Update
router.put("/campgrounds/:id/comments/:comment_id", middleware.isAuthorizedComment, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
       if(err){
           req.flash("error", err.message);
           res.redirect("back");
       } else{
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//Comments delete
router.delete("/campgrounds/:id/comments/:comment_id",  middleware.isAuthorizedComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", err.message);
           res.redirect("back");
        } else {
            req.flash("success", "Comment was deleted!")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});



module.exports = router;