'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/registro', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/registro',
    failureFlash: true
}));

router.post('/', async(req, res, next) => {
    passport.authenticate('local.signin',{
        successRedirect: '/userperfil',
        failureRedirect: '/user/',
        failureFlash:true
    })(req, res, next);
});

router.post('/logout',(req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router