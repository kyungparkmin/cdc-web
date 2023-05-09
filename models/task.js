const Sequelize = require('sequelize');

module.exports = class Task extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
        comment: "사용자명"
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Task',
      tableName: 'tasks',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db){
    db.Task.belongsTo(db.User);
    db.Task.belongsTo(db.Agent, { foreignKey: 'sourceId', as: 'source' });
    db.Task.belongsTo(db.Agent, { foreignKey: 'targetId', as: 'target' });
  }
};