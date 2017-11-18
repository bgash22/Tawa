var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash    = require('connect-flash');

var admin = require('../controller/admin');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/login.ejs', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/admin/user',
    failureRedirect : '/admin',
    failureFlash: true
}));

router.get('/user', isLoggedIn, admin.user);

//User status update AjaxCall
router.post('/updateStatus', isLoggedIn, admin.updateStatus);
//User dalete Ajax call
router.get('/deleteUser', isLoggedIn, admin.deleteUser);

router.get('/places', isLoggedIn, admin.places);
//Add Place Ajax call
router.post('/addPlace', isLoggedIn, admin.addPlace);
//Delete Place Ajax call
router.post('/deletePlace', isLoggedIn, admin.deletePlace);

router.get('/orders', isLoggedIn, admin.orders);

router.post('/deleteOrder', isLoggedIn, admin.deleteOrder);

//Change Password
router.post('/changePassword', isLoggedIn, admin.changePassword);
//Log out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/admin');
})

//Order status Change
router.post('/orderStatus', isLoggedIn, admin.orderStatus);

//Middleware
function isLoggedIn(req, res, next){    
    if(req.isAuthenticated() && req.user.role == 'admin'){
        return next();
    }
    res.redirect('/admin');
}
module.exports = router;
