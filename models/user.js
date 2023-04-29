const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      username: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
        comment: "사용자명"
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: "비밀번호",
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db){

  }
};