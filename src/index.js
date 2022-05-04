'use strict';
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const {database} = require('./keys');
const path = require('path');

//Initializations
const app = express();
require('./lib/passport');
app.set('views', path.join(__dirname, 'views'));

//Settings
app.set('port', process.env.PORT || 4000);
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'ThunderGers',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(fileUpload());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) =>{
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('emp',require('./routes/emp'));
app.use('sa',require('./routes/sa'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting tje server
app.listen(app.get('port'), () => {
    console.log('Server listening on port ', app.get('port'));
});
