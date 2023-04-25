const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users')
const {checkReturnTo} = require('../middleware')

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(checkReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo: true,
}),users.login)

router.get('/logout',users.logout)

module.exports = router;

// router.get('/logout',(req,res)=>{
//     req.logout(function(err){
//         if (err){return next(err);}
//         else {
//             req.flash('success', 'Good Bye')
//             res.redirect('/campgrounds')
//         }
//     });
// })