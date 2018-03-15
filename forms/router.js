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

//create endpoint that checks if a form exists
//multiple endpoints vs one, I will do one
// Post to register a new form 
router.get('/check/:username', jsonParser, (req,res)=> {
  Form.findOne({username:req.params.username}).then((form)=>{
    if (form){
      res.status(200).json(form);
    }
    else{
      res.status(200).json({});
    }
    //res.json(form);
  })
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = [' medicalIssue', ' Medications'];
  const missingField = requiredFields.find(field => !(field in req.body));


  let {username, email, age = '', martial = '', hand = '', interpreter = '',
      medicalIssue, presentIllness = '', tobacco = '', nonmedicalDrugs = '',
      alcohol = '', VD = '', workedLast = '', pastHistory = '', familyHistoryDiabetes = '',
      familyHistoryTb = '', familyHistoryHeartDisease = '', familyHistoryCancer = '',
      otherFamilyHistory = '', disabilityBegin = '', origin = '', otherSpecify = '', Medications


  } = req.body;
 
  
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
//put to update form
router.put('/:formid', jsonParser, (req, res) => {
  const requiredFields = [' medicalIssue', ' Medications'];
  const missingField = requiredFields.find(field => !(field in req.body));


  let {username, email, age = '', martial = '', hand = '', interpreter = '',
      medicalIssue, presentIllness = '', tobacco = '', nonmedicalDrugs = '',
      alcohol = '', VD = '', workedLast = '', pastHistory = '', familyHistoryDiabetes = '',
      familyHistoryTb = '', familyHistoryHeartDisease = '', familyHistoryCancer = '',
      otherFamilyHistory = '', disabilityBegin = '', origin = '', otherSpecify = '', Medications


  } = req.body;
 
  console.log(req.params.formid);
  return Form.
  update({
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
