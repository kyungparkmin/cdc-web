const { User } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.login = async (req, res, next) => {
  try {
    passport.authenticate('local', (authError, user) => {
      if (authError) {
        console.error(authError);
        return res.status(400).json({ message: "로그인 실패" });
      }

      if (!user) {
        return res.status(400).json({ message: "비밀번호가 다릅니다" });
      }

      return req.login(user, async (loginError) => {
        if(loginError) {
          console.error(loginError);
          return res.status(400).json({success: false, message: "로그인에 실패하였습니다"});
        }
        return res.redirect('/');
      })
    })(req, res, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.signup = async (req, res, next) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 12);

  try {
    const user = await User.findOne({ where: { username }});

    if (user) {
      return res.status(400).json({ message: "이미 가입된 아이디 입니다" });
    } else {
      await User.create({ username, password: hash });

      return res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.logout = async (req, res, next) => {
  req.logout(req.user, err => {
    if(err) {
      return next(err);
    }
    req.session.destroy(() => {
      req.session;
    });
    res.redirect('/login');
  });
}