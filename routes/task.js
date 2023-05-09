const express = require('express');
const router = express.Router();

const taskModule = require('../modules/task');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.post('/', isLoggedIn, taskModule.create);
router.delete('/:id', isLoggedIn, taskModule.drop);
router.patch('/:id', isLoggedIn, taskModule.modify);



module.exports = router;
