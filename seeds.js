var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");

data = [
    {
        name: "TEST",
        image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, r"
    },
    {
        name: "TEST",
        image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, r"
    },
    {
        name: "TEST",
        image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, r"
    }
];

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log("removed campground ");
            data.forEach(function(camp) {
                Campground.create(camp, function(err, created){
                    if(err){
                        console.log(err);
                    } else{
                        console.log("added campground");
                        Comment.create(
                        {
                            text: "This is cool",
                            author: "Mahdi"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                created.comments.push(comment);
                                created.save();
                                console.log("Comment created");
                            }
                        }); 
                    }
                });
            });
        }
    });
}

module.exports = seedDB;