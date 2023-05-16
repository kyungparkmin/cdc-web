const express = require('express');
const router = express.Router();

const agentModule = require('../modules/agent');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth');

router.post('/', isLoggedIn, agentModule.create);
router.delete('/:id', isLoggedIn, agentModule.drop);
router.patch('/:id', isLoggedIn, agentModule.modify);



module.exports = router;
