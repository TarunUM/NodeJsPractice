const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  // console.warn(allowedFields);
  // console.warn(obj);
  Object.keys(obj).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete obj[field];
    }
  });
  // console.warn(obj);
  return obj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  console.log(req.user.id);
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user POSTs password data
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError('This route is not allowed for password updates.', 400)
    );
  }

  // 2) Update user documents
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidattors: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: ' This route is not yet defined',
//   });
// };

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: ' This route is not defined! Please use /signup instead',
  });
};

// Do NOT update passwords with this

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: ' This route is not yet defined',
//   });
// };

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: ' This route is not yet defined',
//   });
// };

exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User);
