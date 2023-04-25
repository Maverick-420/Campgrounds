const express = require('express');
const router = express.Router();
const cathcAsync= require('../utils/catchAsync');
const ExpressError= require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema} = require('../schemas.js');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware.js');
const flash = require('connect-flash');
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
    .get(cathcAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,cathcAsync(campgrounds.createCampground))

router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(cathcAsync(campgrounds.renderEditForm))
    .put(isAuthor,isLoggedIn,validateCampground,cathcAsync(campgrounds.updateCampground))
    .delete(isAuthor,isLoggedIn,cathcAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isAuthor,isLoggedIn,cathcAsync(campgrounds.showCampground))

module.exports=router;