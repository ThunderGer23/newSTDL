'use strict';
const axios = require('axios');
const pool = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local.signup', new LocalStrategy({
    usernameField: 'DNI',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async (req, DNI, password, done) => {
    const {phone, email, distrito, provincia, calle} = req.body;
    const RUTA = `https://apistdl.herokuapp.com/dates?DNI=${DNI}`

    const res = await axios.get(RUTA);
    const user = {
        DNI,
        nombre: res.data.nombres,
        apellido_paterno: res.data.apellidoPaterno,
        apellido_materno: res.data.apellidoMaterno,
        telefono: phone,
        distrito,
        provincia,
        calle,
        contrasena: password,
        correo: email,
    };
    user.contrasena = await helpers.encryptPassword(password);
    const NewUser = await pool.query('INSERT INTO usuario set ?',[user]);
    return done(null, NewUser.DNI);
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'DNI',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, DNI, password, done) => {
    const rows = await pool.query(`SELECT * FROM usuario WHERE DNI = ${DNI}`);
    if (rows.length > 0) {
        const user = rows[0];
        const validpassword = helpers.matchPassword(password, user.contrasena);
        if(validpassword){
            done(null,user);
        }else{
            done(null,false);
            console.log('Contraseña incorrecta');
        }
    }else{
        console.log('Usuario incorrecto');
        done(null,false);
    }
}));

//SUPERADMIN

passport.use('local.signinSA', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async(req, usuario, contrasena, done) => {
    const usr = usuario
    try {
      const query = `SELECT * FROM superadmin WHERE nombre_usuario = "${usr}"`;
      const rows = await pool.query(query);
      if (rows.length > 0) {
        const sa = rows[0];
        const validpassword = await helpers.matchPassword(contrasena, sa.contrasena);
        if(validpassword){
          done(null,sa);
        }else{
          console.log('Contraseña incorrecta');
          done(null,false);
        }
      }else{
        console.log('Usuario incorrecto');
        return done(null,false);
      }
    }catch (err){
      console.log(err);
    }
}));

passport.use('local.signupSA', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena',
    session: false,
    passReqToCallback: false
}, async(usuario, contrasena, done) =>{
    console.log(`usuario:${usuario}\ncontrasena:${contrasena}\n`);
    const superAdmin = {
        nombre_usuario: usuario.toString(),
        contrasena,
    }
    superAdmin.contrasena = await helpers.encryptPassword(contrasena)
    const rows = await pool.query('INSERT INTO superadmin set ?', [superAdmin]);
    return done(null, usuario);
}));

//EMPLEADO

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async(DNI, done) => {
    const result = await pool.query(`SELECT * FROM usuario WHERE DNI = "${DNI.DNI}"`);

    const result1 = await pool.query(`SELECT * FROM gestor WHERE DNI = "${DNI.DNI}"`);

    const result2 = await pool.query(`SELECT * FROM superadmin WHERE nombre_usuario = "${DNI.nombre_usuario}"`);

    if (result && result.length > 0) {
        done(null, result);
    }else if (result1 && result1.length > 0) {
        done(null, result1);
    }else if (result2 && result2.length > 0) {
        done(null, result2);
    }else{
        null;
    }
})
