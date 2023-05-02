const express = require('express');
const router = express.Router();

const taskModule = require('../modules/task');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.post('/', isLoggedIn, taskModule.create);
router.get('/', isLoggedIn, taskModule.find);
router.delete('/:id', isLoggedIn, taskModule.drop);
router.patch('/:id', isLoggedIn, taskModule.modify);
router.get('/')

module.exports = router;
