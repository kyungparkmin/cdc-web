const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, async (username, password, done) => {
    try {
      const exUser = await User.findOne({
        attributes: ['id','username', 'password'],
        where: { username }
      });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (!result) {
          return done(null, false, { message: "비밀번호가 일치하지 않습니다" });
        } else {
          return done(null, exUser); // 성공
        }
      } else {
        return done(null, false, { message: "가입되지 않은 유저입니다" });
      }
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};