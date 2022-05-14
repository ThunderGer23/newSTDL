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
  console.log(result[0].ruta);
  if (result) {
      return res.sendFile(result[0].ruta+result[0].nombre_doc);
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
    console.log(req.body);

    if (req.body.start_date != '' && req.body.end_date != ''){
      cond.push(` fecha BETWEEN "${req.body.start_date}" AND "${req.body.end_date}"`);
    }else if(req.body.start_date != ''){
      cond.push(` fecha > "${req.body.start_date}"`);
    }else if(req.body.end_date != ''){
      cond.push(` fecha < "${req.body.end_date}"`);
    }

    cond.push((req.body.dependencia != '0')?` id_depto_origen = ${req.body.dependencia}`:``);

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

    const rows = await pool.query(query);
    console.log(rows);
    res.render('layouts/emp/buscar.hbs',{rows});
});

router.get('/docarchi', (req, res) => {
    res.render('layouts/emp/docarchivados.hbs');
});

router.get('/docrecieve', (req, res) => {
    res.render('layouts/emp/docporrecibir.hbs');
});

router.get('/gentramite', (req,res) => {
    res.render('layouts/emp/generartramite.hbs');
})

router.post('/gentramite', async(req, res) => {
  console.log("imprimir :3");
  try{
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    };
    console.log(">>>>>>>>>>>>>>>>>>>>",req.user[0]);
    console.log(">>>>>>>>>>>>>>>>>>>>",req.body);

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
      id_Usuario:req.user[0].DNI,
      id_Gestor:null,
      id_TipoEnte:req.body.tipoDoc,
    };

    const query = `SELECT COUNT(*) FROM expediente WHERE id_TipoEnte=${req.body.tipoDoc} AND id_Usuario=${req.user[0].DNI};`;
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
    console.log("Success!!!");
    res.redirect('/gentramite');
  }catch(err){
    res.status(500).send(err+'error');
  }
});

router.get('/docprocess', (req, res) => {
    res.render('layouts/emp/documentosenproceso.hbs');
});

module.exports = router
