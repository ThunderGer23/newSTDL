'use strict';
const pool = require('../database');
const express = require('express');
const router = express.Router();

router.get('/logemp', (req, res) => {
    res.render('layouts/emp/logInEmpleado.hbs');
});

router.get('/tramites', async (req, res) => {
    const result = await pool.query(`SELECT * FROM bandejaTramitesRealizados;`);

    if (result) {
        res.render('layouts/usr/bandejaTramitesRealizados.hbs', {result});
    }
});

router.post('/tramites/pdf', async (req, res) => {
    const result = await pool.query(`SELECT nombre_doc, ruta FROM bandejaTramitesRealizados WHERE num_doc = "${Object.keys(req.body)[0]}"`);    
    if (result) {
        return res.sendFile(result.rows[0].ruta+result.rows[0].nombre_doc);
    }
});

router.post('/tramites/deltramite', async (req, res) => {
    try {
        const result = await pool.query(`DELETE FROM tramite WHERE num_doc = "${Object.keys(req.body)[0]}";`);
        (result)?res.redirect('/emp/tramites'):console.log('Error en la consulta');
    }catch (err) {
        console.error(err);
        res.redirect('/emp/tramites');
    }
})

module.exports = router