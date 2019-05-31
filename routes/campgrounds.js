var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/");


//index show all campgrounds
router.get("/campgrounds",function(req,res){
 
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }else{
           res.render("campgrounds/index",{campgrounds:allcampgrounds}); 
        }
    });
// 
});

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
   res.render("campgrounds/new"); 
});

//show route
router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            //console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

//edit campground
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    //is user logged in
        Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
           res.render("campgrounds/edit",{campground: foundCampground});  
             }
    });   
});

//update campground
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
//delete route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
          res.redirect("/campgrounds");  
        }
    });
});

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id:req.user._id,
       username:req.user.username
   }
    var newCampground = {name:name,image:image,description:desc,author:author};
    
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //console.log(newlyCreated);
            res.redirect("/campgrounds"); 
        }
    });
   
}); 




module.exports = router;