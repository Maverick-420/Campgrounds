const express = require('express');
const router = express.Router({mergeParams:true});
const cathcAsync= require('../utils/catchAsync');
const ExpressError= require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js');
const Review = require('../models/review');
const Campground = require('../models/campground');
const reviews = require('../controllers/reviews')

const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware.js');

router.post('/',isLoggedIn,validateReview, cathcAsync(reviews.createReview))

router.delete('/:reviewId',isReviewAuthor,isLoggedIn,cathcAsync(reviews.deleteReview));

module.exports=router;