const { Agent } = require('../models');

exports.create = async (req, res, next) => {
  const { name, ip, username, password, type } = req.body;
  try {
    await Agent.create({ name, ip, username, password, type, UserId: req.user.id });

    res.send('<script>alert("등록되었습니다"); location.href="/agent" </script>')
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.find = async (req, res, next) => {
  try {

  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.modify = async (req, res, next) => {

}

exports.drop = async (req, res, next) => {
  try {
    await Agent.destroy({ where: { id: req.params.id, UserId: req.user.id }});

    res.redirect('/agent');
  } catch (err) {
    console.error(err);
    next(err);
  }
}