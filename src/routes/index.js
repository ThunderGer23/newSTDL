'use strict';

const express = require('express');
const router = express.Router();
const pool = require('../database');
const fs = require('fs');

//all here is code for routes get
router.get('/', (req, res) => {
    res.render('layouts/usr/logInUsuario.hbs');
});

router.get('/registro', (req, res) => {
    res.render('layouts/usr/registroGestor.hbs');
});

router.get('/forgotpass', (req, res) => {
    res.render('layouts/usr/olvideMiContrasena.hbs');
});

router.get('/userperfil', (req, res) => {
  res.render('layouts/usr/homeGestorPerfil.hbs',{user:req.user});
});

router.get('/gentramite', (req, res) => {
    res.render('layouts/usr/generarTramite.hbs');
});

router.get('/contrasena', (req, res) => {
    res.render('layouts/usr/olvideMiContrasena.hbs');
});

router.get('/tramites', async(req, res) => {
  const rows = await pool.query(`SELECT * FROM bandejaTramitesRealizados WHERE id_Usuario=${req.user[0].DNI};`);
  res.render('layouts/usr/bandejaTramitesRealizados.hbs',{rows});
});

router.post('/tramites/documento', async (req, res) => {
  const result = await pool.query(`SELECT nombre_doc, ruta FROM bandejaTramitesRealizados WHERE num_doc = "${Object.keys(req.body)[0]}"`);
  console.log(result[0].ruta);
  if (result) {
      return res.sendFile(result[0].ruta+result[0].nombre_doc);
  }
});

router.post('/tramites/deltramite', async (req, res) => {
    try {
        const result = await pool.query(`DELETE FROM tramite WHERE num_doc = "${Object.keys(req.body)[0]}";`);
        (result)?res.redirect('/tramites'):console.log('Error en la consulta');
    }catch (err) {
        console.error(err);
        res.redirect('/tramites');
    }
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

//all here is code for routes post

router.post('/gentramite', async(req, res) => {
  try{
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    };

    const arch = req.files.documento;

    const userid = req.user[0].DNI;
    fs.mkdir(__dirname+`/docs/${userid}/`,(err) =>{
      if(err){
        console.log("");
      }
    });
    const path = __dirname+`/docs/${userid}/`;

    arch.mv(path+arch.name,async (err) => {
      if(err){null;}});

    const tupaType = {'0':false,'1':true,'2':null};

    const docType = {'1':'C','2':'O','3':'S'};

    let hoy = new Date();

    let year = `${hoy.getFullYear()}`;
    let month = `${hoy.getMonth()+1}`.padStart(2,'0');
    let day = `${hoy.getDate()}`.padStart(2,'0');

    let hr = `${hoy.getHours()}`.padStart(2,'0');
    let min = `${hoy.getMinutes()}`.padStart(2,'0');
    let sec = `${hoy.getSeconds()}`.padStart(2,'0');


    const archivo = {
      id_Documento:null,
      ruta:path,
      nombre:arch.name
    };

    const expediente = {
      id_Ente:null,
      nombre_expediente:req.body.asunto,
      numero_hojas:req.body.numFolio,
      tupa:tupaType[req.body.tupa],
      tupa_desc:null,
      id_Usuario:req.user[0].DNI,
      id_Gestor:null,
      id_TipoEnte:req.body.tipoDoc,
    };


    const query = `SELECT COUNT(*) FROM expediente WHERE id_TipoEnte=${req.body.tipoDoc};`;
    const rowss = await pool.query(query);
    const newId = docType[req.body.tipoDoc]+`${rowss[0]['COUNT(*)']}`.padStart(4,'0');
    const result = await pool.query('INSERT INTO documento SET ?',[archivo]);
    const result2 = await pool.query('INSERT INTO expediente SET ?',[expediente]);
    const siglas = 'BDSM';
    const tramite = {
      id_Tramite:null,
      fecha:year+'-'+month+'-'+day,
      hora:hr+':'+min+':'+sec,
      nombre_Tramite:req.body.details,
      estado:'Pendiente',
      num_doc:newId,
      siglas:siglas,
      id_Ente:result2.insertId,
      id_Movimiento:'1',
      id_TipoTramite:'1',
      id_depto_origen:5,
      id_depto_actual:5,
      id_derivar_a:null
    };
    const result3 = await pool.query('INSERT INTO tramite SET ?',[tramite]);
    const doc_ente = {
      id_Documento:result.insertId,
      id_Ente:result2.insertId
    };
    const result4 = await pool.query('INSERT INTO doc_ente SET ?',[doc_ente]);
    res.redirect('/userperfil');
  }catch(err){
    res.status(500).send(err+'error');
  }
});

router.post('/contrasena', (req, res) => {
});

router.post('/forgotpass', (req, res) => {
});

router.post('/userperfil', (req, res) => {
});

router.post('/tramites', (req, res) => {
});

module.exports = router;
