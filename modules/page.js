const { Agent, Task, Log } = require('../models');

exports.task = async (req, res, next) => {
  const pageNum = parseInt(req.query.page) || 1;
  const limit = 6;

  try {
    const [sources, targets] = await Promise.all([
      Agent.findAll({ where: { UserId: req.user.id, type: 0 }, attributes: ['id', 'name'], raw: true }),
      Agent.findAll({ where: { UserId: req.user.id, type: 1 }, attributes: ['id', 'name'], raw: true })
    ]);

    const {count, rows: tasks} = await Task.findAndCountAll({
      offset: limit * (pageNum - 1),
      attributes: ['id', 'name', 'createdAt', 'sourceId', 'targetId'],
      limit,
      order: [['id', 'DESC']],
      include: [
        {
          model: Agent,
          as: 'source',
          attributes: ['id', 'name']
        },
        {
          model: Agent,
          as: 'target',
          attributes: ['id', 'name']
        }
      ],
      where: { UserId: req.user.id }
    });

    const pageCount = Math.ceil(count / limit);

    res.render('task', { user: req.user, title: "Task", targets, sources, tasks, pageCount, page: pageNum });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.agent = async (req, res, next) => {
  const pageNum = parseInt(req.query.page) || 1;
  const limit = 6;

  try {
    const {count, rows: agents} = await Agent.findAndCountAll({
      offset: limit * (pageNum - 1),
      attributes: ['id', 'name', 'path', 'createdAt', 'type', 'status'],
      limit,
      order: [['id', 'DESC']],
      where: { UserId: req.user.id }
    });


    const pageCount = Math.ceil(count / limit);

    res.render('agent', { user: req.user, title: "Agent", agents, pageCount, page: pageNum, agent: null });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.params.id);

    res.json(agent);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.log = async (req, res, next) => {
  res.render('log', { user: req.user, title: "Log" });
}

exports.detail = async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    const log = await Log.findAll({
      where: { AgentId: req.params.id },
      include: Agent
    });

    console.log(agent);

    res.render('detail', { user: req.user, title: "Detail", agent, log});
  } catch (error) {
    console.error(error);
    next(error);
  }
}
