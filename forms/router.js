'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Form} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const {User} = require('../users/models'); // is this right?
const passport = require('passport');
const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');

passport.use(localStrategy);
passport.use(jwtStrategy);



// Post to register a new form
router.post('/', jsonParser, (req, res) => {
  const requiredFields = [' medicalIssue', ' Medications'];
  const missingField = requiredFields.find(field => !(field in req.body));

 /* if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
*/
  //review with luis, do I need this?
  /*
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
*/
  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.

  //don't need to trim so I will comment out

  //const explicityTrimmedFields = ['username', 'password'];
  //const nonTrimmedField = explicityTrimmedFields.find(
 //   field => req.body[field].trim() !== req.body[field]
  //);

 // if (nonTrimmedField) {
  //  return res.status(422).json({
  //    code: 422,
  //    reason: 'ValidationError',
  //    message: 'Cannot start or end with whitespace',
  //    location: nonTrimmedField
   // });
  //}

 /* const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  }; 
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  } */
//dont need to initialize values that will always be submitted
  let {username, email, age = '', martial = '', hand = '', interpreter = '',
      medicalIssue, presentIllness = '', tobacco = '', nonmedicalDrugs = '',
      alcohol = '', VD = '', workedLast = '', pastHistory = '', familyHistoryDiabetes = '',
      familyHistoryTb = '', familyHistoryHeartDisease = '', familyHistoryCancer = '',
      otherFamilyHistory = '', disabilityBegin = '', origin = '', otherSpecify = '', Medications


  } = req.body;
 
  
  //email?
  return Form.
  create({
            username: req.body.username,
            email: req.body.email,
            age: req.body.age,
            martial: req.body.martial,
            interpreter: req.body.interpreter,
            medicalIssue: req.body.medicalIssue,
            presentIllness: req.body.presentIllness,
            tobacco: req.body.tobacco,
            nonmedicalDrugs: req.body.nonmedicalDrugs,
            alcohol: req.body.alcohol,
            VD: req.body.VD,
            workedLast: req.body.workedLast,
            pastHistory: req.body.pastHistory,
            familyHistoryDiabetes: req.body.familyHistoryDiabetes,
            familyHistoryTb: req.body.familyHistoryTb,
            familyHistoryHeartDisease: req.body.familyHistoryHeartDisease,
             familyHistoryCancer: req.body.familyHistoryCancer,
            otherFamilyHistory: req.body.otherFamilyHistory,
            disabilityBegin: req.body.disabilityBegin,
            origin: req.body.origin,
            otherSpecify: req.body.otherSpecify,
            Medications: req.body.Medications,
        })
  /*  .count() 
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password, how do I hash all my values? not enough params i believe, put them in an array or object?
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    }) */
    .then(form => {
      //console.log('form', form);
      return res.status(201).json(form);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'test'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
/*router.get('/', (req, res) => {
  return Form.find()
    .then(forms => res.json(forms.map(user => form.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});
*/

const jwtAuth = passport.authenticate('jwt', { session: false });

//i re-used this endpoint for forms
// A protected endpoint which needs a valid JWT to access it
router.get('/', jwtAuth, (req, res) => {
 Form.find()
  .then(forms => { console.log(forms)
    res.json(forms);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: 'something went wrong'
    });    
  }) 
});
module.exports = {router};
