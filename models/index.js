const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./user');
const Agent = require('./agent');
const Task = require('./task');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Agent = Agent;
db.Task = Task;


User.init(sequelize);
Agent.init(sequelize);
Task.init(sequelize);

User.associate(db);
Agent.associate(db);
Task.associate(db);


module.exports = db;