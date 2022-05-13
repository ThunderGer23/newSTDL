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

router.post('/logSA', async(req, res, next) => {
    passport.authenticate('local.signinSA', {
        successRedirect: '/sa/homeadmin',
        failureRedirect: '/sa/',
        failureFlash:true
    })(req, res, next);
});

router.post('/registrarSA', passport.authenticate('local.signupSA', {
    successRedirect: '/sa/homeadmin',
    failureRedirect: '/registrarSA',
    failureFlash:true
}));

router.post('/emp/logemp', async(req, res, next) => {
    passport.authenticate('local.signinemp',{
        successRedirect: '/emp/municipal',
        failureRedirect: '/emp/logemp',
        failureFlash:true
    })(req, res, next);
});

router.post('/registroemp', passport.authenticate('local.signupemp',{
    successRedirect: '/emp/logemp',
    failureRedirect: '/admin/registraremp',
    failureFlash:true
}));

router.post('/logout',(req, res) => {
    req.logOut();
    res.redirect('/');
});

router.post('/logoutemp',(req, res) => {
    req.logOut();
    res.redirect('/emp/logemp');
});

router.post('/logoutsa',(req, res) => {
    req.logOut();
    res.redirect('/admin');
});

module.exports = router
