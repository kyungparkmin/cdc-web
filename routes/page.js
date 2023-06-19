const express = require('express');
const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth')

const pageModule = require('../modules/page');

router.get('/', isLoggedIn, pageModule.task);

router.get('/agent', isLoggedIn, pageModule.agent);

router.get('/agent/:id', isLoggedIn, pageModule.getAgentById);

router.get('/log', isLoggedIn, pageModule.log);

router.get('/detail/:id', isLoggedIn, pageModule.detail);

router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('signup');
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login');
});



module.exports = router;