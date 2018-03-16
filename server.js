'use strict';
const {User} = require('./users')
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// console.log(bobby); // De Niro - the variable name is bobby, not robert
const { router: usersRouter } = require('./users');
const { router: formsRouter } = require('./forms');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

/*
const cors = require('cors');
//const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors()
);
*/


const { PORT, DATABASE_URL } = require('./config');

//creating admin account
/*
User.hashPassword('admin').then((hash)=>{
  User.create({
    username: 'admin',
    email: 'admin@admin.com',
    password: hash,
    firstName: 'admin',
    lastName: 'admin',
    admin: true
  }).then(res =>console.log(res));
});

*/


const app = express();

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/forms/', formsRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

//i re-used this endpoint for forms
// A protected endpoint which needs a valid JWT to access it
/*app.get('/api/forms', (req, res) => {
console.log('entering enter');
res.json('something');
 /* Forms.find()
  .then(forms => { console.log(forms)
    res.json(forms);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: 'something went wrong'
    });    
  }) */
//});
//app.use('*', (req, res) => {
  //return res.status(404).json({ message: 'Not Found' });
//}); 

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
