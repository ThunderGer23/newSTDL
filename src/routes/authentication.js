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
        successRedirect: '/admin/homeadmin',
        failureRedirect: '/admin/',
        failureFlash:true
    })(req, res, next);
})

router.post('/registrarSA', passport.authenticate('local.signupSA', {
    successRedirect: '/sa/homeadmin',
    failureRedirect: '/sa/registrarSA',
    failureFlash:true
}));

router.post('/logout',(req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router
