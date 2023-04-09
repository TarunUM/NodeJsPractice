const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.get('/', authController.isLoggedin, viewsController.getOverview);
router.get('/tours/:slug', authController.isLoggedin, viewsController.getTour);
router.get('/login', authController.isLoggedin, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
