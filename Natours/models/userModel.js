const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'E-mail must be provided'],
    unique: [true, 'E-mail must be unique'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email address'],
  },
  password: {
    type: String,
    required: [true, 'password must be provided'],
    trim: true,
    select: false,
    minlength: 6,
    maxlength: 18,
  },
  photo: {
    type: String,
    default: `${__dirname}/../dev-data/img/monica.jpg`,
    trim: true,
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'passwordConfirmation must be provided'],
    trim: true,
    // This will only work with .SAVE or .Create
    validate: [
      function (el) {
        return el === this.password;
      },
      'passwordConfirmation must be same as password',
    ],
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only runs if the password is modified
  if (!this.isModified('password')) {
    return next();
  }
  //To encrypt the password with cast of 12
  this.password = await bcrypt.hash(this.password, 12);

  //To delete the passwordConfirmation field
  this.passwordConfirmation = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
