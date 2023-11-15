const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require('../middleware.js'); 
const reviewController=require("../controllers/reviews.js");


router.post("/",
isLoggedIn,
validateReview,wrapAsync(reviewController.createReview));

//Delete review route

router.delete("/:reviewId",isReviewAuthor,isLoggedIn,
wrapAsync(reviewController.deleteReview)
);

module.exports=router;