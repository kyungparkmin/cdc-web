const express = require('express');
const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.render('layout');
});

router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('signup');
})

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login');
})


module.exports = router;
