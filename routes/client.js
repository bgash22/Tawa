var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash    = require('connect-flash');

var client = require('../controller/client');

/* GET home page. */
router.get('/', client.index);

//Book Ajax Call
router.post('/book', isLoggedIn, client.book);

router.post('/qbook', isLoggedIn, client.qbook);

//User LogIn
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/user/success',
    failureRedirect : '/user/failure',
    failureFlash: true
}));

//User SignUp
// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/user/success',
    failureRedirect : '/user/failure',
    failureFlash: true
}));

router.get('/success', function(req, res){
    res.json({ret:true});
})
router.get('/failure', function(req, res){
    res.json({ret:false});
})

//User Log out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.json({ret:false, logIn:false});
    }    
}

module.exports = router;
