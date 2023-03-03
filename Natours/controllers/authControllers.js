const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signtoken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //   const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });

  const token = signtoken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if the enail and password exists
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  // 2)Checks if the user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // since we have declared the password as select: fakse in model so we have to explicitly call it using select('+__') functions

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is correct then return token
  console.log(user._id);
  const token = signtoken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
