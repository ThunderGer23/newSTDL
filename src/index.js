'use strict';
const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');

const path = require('path');
//Initializations
const app = express();
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
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

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