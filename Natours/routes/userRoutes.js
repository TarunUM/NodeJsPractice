const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

// MiddleWare to protect routes
router.use(authController.protect);

router.patch('/updatepassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// MiddleWare to restrict routes
router.use(authController.restrictTo('admin', 'manager'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
