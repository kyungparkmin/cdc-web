const express = require('express');
const router = express.Router();

const agentModule = require('../modules/agent');

const { isLoggedIn } = require('../middlewares/auth');

router.post('/', isLoggedIn, agentModule.create);
router.delete('/:id', isLoggedIn, agentModule.drop);
router.patch('/:id', isLoggedIn, agentModule.modify);
router.get('/start/:id', isLoggedIn, agentModule.start);
router.get('/stop/:id', isLoggedIn, agentModule.stop);



module.exports = router;
