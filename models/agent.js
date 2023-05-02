const Sequelize = require('sequelize');

module.exports = class Agent extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      ip: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      type: {
        type: Sequelize.INTEGER, // 0 이면 source 1 이면 target
        allowNull: true
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
  }
};