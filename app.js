const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const { expressCspHeader, SELF, INLINE } = require('express-csp-header');
const { spawn } = require('child_process');
const fs = require('fs')
require('dotenv').config();

const indexRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const agentRouter = require('./routes/agent');
const taskRouter = require('./routes/task');

const app = express();

const passportConfig = require('./passport');
passportConfig();

const { sequelize } = require('./models');
const cluster = require("cluster");

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24000 * 60 * 60, // 24 hours
  },
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressCspHeader({
  directives: {
    'script-src': [SELF, INLINE, 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
  },
}));

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/task', taskRouter);
app.use('/agent', agentRouter);

app.get('/add-worker', (req, res) => {
  const workerId = Date.now(); // 고유한 워커 ID 생성

  const cpp = spawn('g++', ['test.cpp', '-o', `test_${workerId}`]);
  cpp.on('close', (code) => {
    console.log(`C++ 파일 컴파일 완료 (${code})`);

    const exe = spawn(`./test_${workerId}`);

    exe.stdout.on('data', (data) => {
      console.log(`stdout: ${data}, ${workerId}`);
    });
    exe.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);

      deleteExeFile(workerId);
    });
    exe.on('close', (code) => {
      console.log(`C++ 파일 실행 완료 (${code})`);

      deleteExeFile(workerId)
    });
  });

  console.log(`Worker ${workerId} added`);
  res.redirect('/');
});

// 실행된 exe 파일 삭제하는 함수
const deleteExeFile = (workerId) => {
  const exeFileName = `test_${workerId}.exe`;
  fs.unlink(exeFileName, (err) => {
    if (err) {
      console.error(`Failed to delete file ${exeFileName}: ${err}`);
    } else {
      console.log(`File ${exeFileName} deleted`);
    }
  });
};

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(3000, () => {
  console.log(`listening on port ${server.address().port}`);
});