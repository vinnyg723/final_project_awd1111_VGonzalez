//TO-DO

// Implement authentication on the INSERT and UPDATE routes to prevent unauthenticated users
// from accessing them



require('dotenv').config();

// import libraries
const debug = require('debug')('app:server');
const express = require('express');
const hbs = require('express-handlebars');
const config = require('config');
const moment = require('moment');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// install ObjectId validator
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

// create and configure application
const app = express();
app.engine(
  'handlebars',
  hbs({
    helpers: {
      formatPrice: (price) => (price ? '$' + price.toFixed(2) : ''),
      formatDate: (date) => (date ? moment(date).format('ll') : ''),
      formatDatetime: (date) => (date ? moment(date).format('lll') : ''),
      fromNow: (date) => (date ? moment(date).fromNow() : ''),
      not: (value) => !value,
      eq: (a, b) => a == b,
      or: (a, b) => a || b,
      and: (a, b) => a && b,
      tern: (condition, a, b) => (condition ? a : b),
    },
  })
);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(cookieParser());

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/thankYou', (req, res) => res.render('thankYou', { title: 'Thank You' }));
app.get('/stream/jquery', (req, res) => res.render('stream/jquery'));
app.get('/stream/xhr', (req, res) => res.render('stream/xhr'));
app.get('/stream/fetch', (req, res) => res.render('stream/fetch'));
app.get('/stream/oboe', (req, res) => res.render('stream/oboe'));
app.get('/stream/oboe-worker', (req, res) => res.render('stream/oboe-worker'));
app.use('/api/search', require('./api/search'));
app.use('/api/car', require('./api/car'));
app.use('/api/stream', require('./api/stream'));
app.use('/api/account', require('./api/account'));
app.use('/api/admin', require('./api/admin'));
app.use('/account', require('./routes/account'));
app.use('/car', require('./routes/car'));
app.use('/admin', require('./routes/admin'));
app.get('/search', (req, res) => res.render('search', { title: 'Search Page' }));

// static files
app.use('/', express.static('public'));
// 404 error page
app.use(require('./middleware/error404'));
// 500 error page
app.use(require('./middleware/error500'));

// start app
const hostname = config.get('http.hostname');
const port = config.get('http.port');
app.listen(port, () => {
  debug(`Server running at http://${hostname}:${port}/`);
});
