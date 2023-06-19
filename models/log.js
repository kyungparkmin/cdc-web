const Sequelize = require('sequelize');

module.exports = class Log extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      message: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Log',
      tableName: 'logs',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db){
    db.Log.belongsTo(db.Agent, { foreignKey: 'AgentId' });
  }
};