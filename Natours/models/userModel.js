const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'admin', 'manager', 'guide', 'lead-guide'],
    default: 'admin',
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
  pwChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //Only runs if the password is modified
  console.log('hello1');
  if (!this.isModified('password')) {
    return next();
  }
  //To encrypt the password with cast of 12
  this.password = await bcrypt.hash(this.password, 12);

  //To delete the passwordConfirmation field
  this.passwordConfirmation = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  //Only runs if the password is modified
  console.log('hello2');
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  // 1000 says that password is already changed, token Invalid
  User.pwChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = async function (JWTTimeStamp) {
  if (this.pwChangedAt) {
    const changedTimeStamp = parseInt(this.pwChangedAt.getTime() / 1000, 10);

    console.log(changedTimeStamp, JWTTimeStamp);

    return JWTTimeStamp < changedTimeStamp;
  }
  // False Means Not Changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Create a new password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token and set it in
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // Set the expiration date in milliseconds
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
