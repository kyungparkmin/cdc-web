const { Agent } = require('../models');

exports.task = async (req, res, next) => {
  try {
    const [sources, targets] = await Promise.all([
      Agent.findAll({ where: { UserId: req.user.id, type: 0 } }),
      Agent.findAll({ where: { UserId: req.user.id, type: 1 } })
    ]);

    res.render('task', { user: req.user.dataValues, title: "Task", targets, sources })
  } catch (err) {
    console.error(err);
    next(err);
  }
}