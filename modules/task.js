const { User } = require('../models');

exports.create = async (req, res, next) => {
  const { name, UserId, sourceId, targetId } = req.body;
  try {
    await User.create({ name, UserId, sourceId, targetId });

    res.redirect('/');
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

exports.drop = async (req, res, next) => {
  try {

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

exports.findSources = async (req, res, next) => {

}

exports.findTargets = async (req, res, next) => {

}