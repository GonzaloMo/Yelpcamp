const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


// Require the middleware
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

// Require the controllers
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}) , users.login)

router.get('/logout', users.renderLogout);

module.exports = router;
