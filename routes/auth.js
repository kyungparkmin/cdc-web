const express = require('express');
const router = express.Router();

const authModule = require('../modules/auth');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.post('/login', isNotLoggedIn, authModule.login);
router.post('/signup', isNotLoggedIn, authModule.signup);
router.get('/logout', isLoggedIn, authModule.logout);

module.exports = router;
