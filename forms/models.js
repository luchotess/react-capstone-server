'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const FormSchema = mongoose.Schema({

  username: {type: String},
  email: {
    type: String
    //required: true
    //unique: true
  },
  age: {
    type: String
  },
  marital: {type: String, default: ''},
  hand: {type: String, default: ''},
  interpreter: {type: String, default: ''},
  medicalIssue: {type: String, default: ''},
  presentIllness: {type: String, default: ''},
  tobacco: {type: String},
  nonmedicalDrugs: {type: String},
  alcohol: {type: String},
  VD: {type: String},
  workedLast: {type: String, default: ''},
  pastHistory: {type: String, default: ''},
  familyHistoryDiabetes: {type: String, default: ''},
  familyHistoryTb: {type: String, default: ''},
  familyHistoryHeartDisease: {type: String, default: ''},
  familyHistoryCancer: {type: String, default: ''},
  otherFamilyHistory: {type: String, default: ''},
  disabilityBegin: {type: String, default: ''},
  origin: {type: String},
  otherSpecify:{type: String, default: ''},
  Medications: {type: String, default: '', required: true}

 

});

//what is serializing?
/*
FormSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

*/

//FormSchema.methods.validatePassword = function(password) {
  //return bcrypt.compare(password, this.password);
//};

//hash things here, shoukd i try hashing all of the medical info?
//Can i Do that like this below?

/*
FormSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};
*/

const Form = mongoose.model('Form', FormSchema);

module.exports = {Form};