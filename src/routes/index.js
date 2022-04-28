'use strict'
const express = require('express');
const router = express.Router();
const pool = require('../database');
const fs = require('fs')

//all here is code for routes get
router.get('/', (req, res) => {
    res.render('layouts/usr/logInUsuario.hbs');
});

router.get('/registro', (req, res) => {
    res.render('layouts/usr/registroGestor.hbs');
});

router.get('/contrasena', (req, res) => {
    res.render('layouts/usr/olvideMiContrasena.hbs');
});

router.get('/about', (req,res)=>{
    res.render('layouts/about.hbs');
});

router.get('/terms', (req,res)=>{
    res.render('layouts/terms.hbs');
});

router.get('/faq', (req,res)=>{
    res.render('layouts/faq.hbs');
});

//all here is code for routes get
router.post('/contrasena', (req, res) => {
    console.log(req.body);
});

module.exports = router;