const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-{UserID}-{CurrentTime}.{fileExtension}
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not An Image, Please Upload Only Images', 400), false);
  }
};

exports.resizeUserPhoto = (req, file, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

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
  // console.log(req.user.id);
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
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
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
exports.uploadUserPhoto = upload.single('photo');
