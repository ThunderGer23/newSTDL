'use strict';
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('layouts/sa/login-admin.hbs');
});

router.get('/homeadmin', (req, res) => {
    res.render('layouts/sa/home.hbs',req.user[0]);
});

module.exports = router
