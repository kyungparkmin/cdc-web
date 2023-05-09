const { Task, Agent } = require('../models');

exports.create = async (req, res, next) => {
  const { name, sourceId, targetId } = req.body;
  try {
    await Task.create({ name, UserId: req.user.id , sourceId, targetId });

    res.send('<script>alert("작업이 생성되었습니다"); location.href = "/"</script>')
  } catch (err) {
    console.error(err);
    next(err);
  }
}


exports.drop = async (req, res, next) => {
  try {
    await Task.destroy({ where: { id: req.params.id, UserId: req.user.id }});

    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.modify = async (req, res, next) => {
  try {

  } catch (err) {
    console.error(err);
    next(err);
  }
}