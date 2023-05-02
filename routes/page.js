const express = require('express');
const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth')

const pageModule = require('../modules/page');

router.get('/', isLoggedIn, pageModule.task);

router.get('/agent', isLoggedIn, (req, res) => {
  res.render('agent', { user: req.user.dataValues, title: "Agent"});
})

router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('signup');
})

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login');
})


module.exports = router;
