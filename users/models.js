'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//add admin type to scheme

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
   email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},

  admin: {
    type: Boolean
  }
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    email: this.email || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    admin: this.admin ||false,
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
