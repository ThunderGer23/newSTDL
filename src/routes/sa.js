'use strict';
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('layouts/sa/login-admin.hbs');
});

router.get('/homeadmin', (req, res) => {
    res.render('layouts/sa/home.hbs',req.user[0]);
});

router.get('/registrarSA', (req, res) => {
    res.render('layouts/sa/registrar-sa.hbs');
});

/*router.post('/registrarSA', (req, res) => {
    res.render('layouts/sa/registrar-sa.hbs');
});*/

router.get('/registraremp', (req, res) => {
    res.render('layouts/sa/registroEmpleado.hbs');
});

router.get('/gestA', (req, res) => {
    res.render('layouts/sa/gestionAreas.hbs');
});

router.post('/gestA', async (req, res) => {
    const depto = {
        nombre: req.body.nombre
    };
    query = await pool.query('INSERT INTO departamento SET ?',[depto]);
    res.render('layouts/sa/gestionAreas.hbs');
});

router.get('/gestionar-cargo', (req, res) => {
    res.render('layouts/superadmin/gestionCargo.hbs');
});

module.exports = router
