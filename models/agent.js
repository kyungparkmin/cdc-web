const Sequelize = require('sequelize');

module.exports = class Agent extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      path: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      topic: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      database: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      table: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      type: {
        type: Sequelize.INTEGER, // 0 이면 source 1 이면 target
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER, // 0 이면 중지 1이면 실행중
        allowNull: false,
        defaultValue: 0
      },
      target_ip: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      target_port: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      target_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      target_password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Agent',
      tableName: 'agents',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db){
    db.Agent.belongsTo(db.User);
    db.Agent.hasMany(db.Log, { foreignKey: 'AgentId' });
  }
};