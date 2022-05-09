'use strict';
const pool = require('../database');
const express = require('express');
const router = express.Router();

router.get('/logemp', (req, res) => {
    res.render('layouts/emp/logInEmpleado.hbs');
});

router.get('/userperfil', (req, res) => {
    res.render('layouts/emp/empPerfil.hbs');
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
});

router.get('/municipal', (req, res) => {
    res.render('layouts/emp/home-emp.hbs');       
});

router.get('/search', (req, res) => {
    res.render('layouts/emp/buscar.hbs');
});

router.post('/search', async (req, res) => {
    
    let cond = [];
    let query = 'SELECT * FROM bandejaTramitesRealizados'

    if (req.body.start_date != '' && req.body.end_date != ''){
      cond.push(` fecha BETWEEN "${req.body.start_date}" AND "${req.body.end_date}"`);
    }else if(req.body.start_date != ''){
      cond.push(` fecha > "${req.body.start_date}"`);
    }else if(req.body.end_date != ''){
      cond.push(` fecha < "${req.body.end_date}"`);
    }

    cond.push((req.body.dependencia != '0')?` id_Depto = ${req.body.dependencia}`:``);

    cond.push((req.body.detalle != '')?` nombre_Tramite LIKE "%${req.body.detalle}%"`:``);

    cond.push((req.body.tipo_expediente != '0')?` id_TipoEnte = ${req.body.tipo_expediente}`:``);

    cond.push((req.body.numero != '')?` num_doc = "${req.body.numero}"`:``);

    cond.push((req.body.siglas != '')?` siglas LIKE "%${req.body.siglas}%"`:``);

    cond.push((req.body.asunto != '')?` nombre_Expediente LIKE "%${req.body.asunto}%"`:``);

    cond = cond.filter(val => {
      return val;
    });

    query += (cond.length > 0)?' WHERE':'';

    for(let c in cond){
      query += (c < cond.length-1)?cond[c]+' AND':cond[c];
    };


    console.log(query);

    const rows = await pool.query(query);
    res.render('layouts/emp/buscar.hbs',{rows});
});

router.get('/docarchi', (req, res) => {
    res.render('layouts/emp/docarchivados.hbs');
});

router.get('/docrecieve', (req, res) => {
    res.render('layouts/emp/docporrecibir.hbs');
});

router.get('/gentramite', (req, res) => {
    res.render('layouts/emp/generartramite.hbs');
});

router.get('/docprocess', (req, res) => {
    res.render('layouts/emp/documentosenproceso.hbs');
});

module.exports = router