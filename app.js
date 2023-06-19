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

let moduleProcesses = {};

const { Agent, Log } = require('./models');

app.get('/agent/start/:id', async (req, res) => {
  const workerId = req.params.id // 고유한 워커 ID 생성

  await Agent.update({ status: 1 }, { where: { id: req.params.id } }); // 상태를 직접적으로 업데이트합니다.

  const cpp = spawn('g++', ['test.cpp', '-o', `test_${workerId}`]);
  cpp.on('close', (code) => {
    console.log(`C++ 모듈 컴파일 완료 (${code})`);

    const exe = spawn(`./test_${workerId}`);
    moduleProcesses[workerId] = {
      process: exe,
      name: `test_${workerId}`
    };

    console.log(moduleProcesses);

    exe.stdout.on('data', async(data) => {
      console.log(`stdout: ${data}, ${workerId}`);

      await Log.create({ message: data.toString(), AgentId: workerId});
    });
    exe.stderr.on('data', async(data) => {
      console.error(`stderr: ${data}`);

      deleteExeFile(workerId);

      await Agent.update({ status: 9 }, { where: { id: req.params.id } }); // 상태를 직접적으로 업데이트합니다.
    });
    exe.on('close', async(code) => {
      console.log(`C++ 모듈 실행 완료 (${code})`);

      deleteExeFile(workerId)

      await Agent.update({ status: 0 }, { where: { id: req.params.id } }); // 상태를 직접적으로 업데이트합니다.
    });
  });

  console.log(`Worker ${workerId} added`);
  res.redirect('/');
});

app.get('/agent/stop/:id', async (req, res, next) => {
  const workerId = req.params.id;
  console.log(`Exiting process ${workerId}`);

  await Agent.update({ status: 0 }, { where: { id: req.params.id } }); // 상태를 직접적으로 업데이트합니다.

  if (moduleProcesses[workerId]) {
    moduleProcesses[workerId].process.kill(); // 지정된 프로세스 종료
    delete moduleProcesses[workerId];

    deleteExeFile(workerId);
  }

  res.redirect('/');
})

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


// 0 = 중지됨 1 = 실행중 9 = 에러로 인한 중지