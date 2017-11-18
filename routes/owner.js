var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash    = require('connect-flash');

var owner = require('../controller/owner');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('owner/login.ejs', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/owner/orders',
    failureRedirect : '/owner',
    failureFlash: true
}));

router.get('/orders', isLoggedIn, owner.orders);

//Order status Change
router.post('/orderStatus', isLoggedIn, owner.orderStatus);


//Change Password
router.post('/changePassword', isLoggedIn, owner.changePassword);
//Log out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/owner');
})

//Middleware
function isLoggedIn(req, res, next){    
    if(req.isAuthenticated() && req.user.role == 'owner'){
        return next();
    }
    res.redirect('/owner');
}
module.exports = router;
