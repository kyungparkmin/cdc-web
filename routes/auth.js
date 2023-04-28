const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/login', );

module.exports = router;
