'use strict';
const pool = require('../database');
const express = require('express');
const router = express.Router();
const fs = require('fs');

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

router.post('/docprocess/pdf', async (req, res) => {
  const result = await pool.query(`SELECT nombre_doc, ruta FROM bandejaTramitesRealizados WHERE num_doc = "${Object.keys(req.body)[0]}"`);
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
    res.render('layouts/emp/buscar.hbs',{rows});
});

router.get('/docarchi', (req, res) => {
    res.render('layouts/emp/docarchivados.hbs');
});

router.get('/docrecieve', async(req, res) => {
  try{
    const empleado = await pool.query(`SELECT * FROM gestor WHERE DNI='${req.user[0].DNI}';`);
    const rows = await pool.query(`SELECT * FROM bandejaTramitesRealizados WHERE id_derivar_a=${empleado[0].id_Depto};`);
    res.render('layouts/emp/docporrecibir.hbs',{rows});
  }catch(error){
    res.send(error);
  }
});

router.post('/docrecieve',async(req,res) =>{
  const derivado = await pool.query(`SELECT id_derivar_a FROM tramite WHERE num_doc="${req.body.docforrecepcionar}";`);
  const derivacion = await pool.query(`UPDATE tramite SET id_depto_actual=${derivado[0].id_derivar_a} ,id_derivar_a=NULL WHERE num_doc="${req.body.docforrecepcionar}";`);
  res.redirect('/emp/docrecieve');
})

router.get('/gentramite', (req,res) => {
    res.render('layouts/emp/generartramite.hbs');
})

router.post('/gentramite', async(req, res) => {
  try{
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    };

    const arch = req.files.documento;

    const userid = req.user[0].DNI;
    fs.mkdir(__dirname+`/docs/`,(err) =>{
      if(err){
        console.log("");
      }
    });
    fs.mkdir(__dirname+`/docs/${userid}/`,(err) =>{
      if(err){
        console.log("");
      }
    });
    const path = __dirname+`/docs/${userid}/`;

    arch.mv(path+arch.name,async (err) => {
      if(err){null;}});

    const tupaType = {'0':false,'1':true,'2':null};

    const docType = {'1':'C','2':'O','3':'S','4':'M','5':'A'};

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
      numero_hojas:req.body.folios,
      tupa:(req.body.procedimientotupa)?(req.body.procedimientotupa.length > 0):false,
      tupa_desc:req.body.procedimientotupa,
      id_Usuario:null,
      id_Gestor:req.user[0].DNI,
      id_TipoEnte:req.body.tipodocumento,
    };

    (req.body.tipodocumento)?null:req.body.tipodocumento=2;

    const query = `SELECT COUNT(*) FROM expediente WHERE id_TipoEnte=${req.body.tipodocumento};`;
    const rowss = await pool.query(query);
    const newId = docType[req.body.tipodocumento]+`${rowss[0]['COUNT(*)']}`.padStart(4,'0');
    const result = await pool.query('INSERT INTO documento SET ?',[archivo]);
    const result2 = await pool.query('INSERT INTO expediente SET ?',[expediente]);
    const empleado = await pool.query(`SELECT * FROM gestor WHERE DNI='${req.user[0].DNI}';`);
    const tramite = {
      id_Tramite:null,
      fecha:year+'-'+month+'-'+day,
      hora:hr+':'+min+':'+sec,
      nombre_Tramite:req.body.detalle,
      estado:'Pendiente',
      num_doc:newId,
      siglas:req.body.siglas,
      id_Ente:result2.insertId,
      id_Movimiento:'1',
      id_TipoTramite:'1',
      id_depto_origen:empleado[0].id_Depto,
      id_depto_actual:null,
      id_derivar_a:empleado[0].id_Depto
    };

    const result3 = await pool.query('INSERT INTO tramite SET ?',[tramite]);
    const doc_ente = {
      id_Documento:result.insertId,
      id_Ente:result2.insertId
    };

    const result4 = await pool.query('INSERT INTO doc_ente SET ?',[doc_ente]);
    res.redirect('/emp/gentramite');
  }catch(err){
    res.status(500).send(err+'error');
  }
});

router.get('/docprocess', async(req, res) => {
  try{
    const empleado = await pool.query(`SELECT * FROM gestor WHERE DNI='${req.user[0].DNI}';`);
    const rows = await pool.query(`SELECT * FROM bandejaTramitesRealizados WHERE id_depto_actual=${empleado[0].id_Depto};`);
    res.render('layouts/emp/documentosenproceso.hbs',{rows});
  }catch(error){
    res.send(error);
  }
});

module.exports = router
