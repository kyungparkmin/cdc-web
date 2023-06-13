const { Agent } = require('../models');
const fs = require('fs');
const ini = require('ini');
const { spawn } = require('child_process');

let moduleProcesses = {}; // 모듈을 추적하기 위한 객체

exports.create = async (req, res, next) => {
  const { name, path, topic, username, password, database, table } = req.body;
  try {
    await Agent.create({ name, path, topic, username, password, database, table, UserId: req.user.id });

    const configData = {
      'kafka-path': path,
      'kafka-topic': topic,
      'kafka-username': username,
      'kafka-password': password,
      'db-name': database,
      'table-name': table
    };

    writeIniFile(configData, name);

    res.send('<script>alert("등록되었습니다"); location.href="/agent" </script>')
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.modify = async (req, res, next) => {
  const { name, path, topic,username, password, database, table } = req.body;
  try {
    const agent = await Agent.findByPk(req.params.id);

    if (!agent) {
      return res.status(404).send('Agent not found');
    }

    // Update the agent with the new data
    await agent.update({ name, path, topic, username, password, database, table });

    const configData = {
      'kafka-path': path,
      'kafka-topic': topic,
      'kafka-username': username,
      'kafka-password': password,
      'db-name': database,
      'table-name': table
    };

    writeIniFile(configData, name);

    res.send('<script>alert("수정되었습니다"); location.href="/agent" </script>');
  } catch (err) {
    console.error(err);
    next(err);
  }
};


exports.drop = async (req, res, next) => {
  try {
    await Agent.destroy({ where: { id: req.params.id, UserId: req.user.id }});

    res.redirect('/agent');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.start = async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.params.id); // 기본 키 조회를 위해 findByPk 사용

    const newStatus = agent.status === 0 ? 1 : 0; // 새로운 상태 값을 결정합니다.

    await Agent.update({ status: newStatus }, { where: { id: req.params.id } }); // 상태를 직접적으로 업데이트합니다.

    res.send('실행중입니다');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

/*exports.start1 = async (req, res, next) => {
  if (cluster.isMaster) {
    const newWorker = cluster.fork();

    const module = spawn('g++', ['test.cpp', '-o', `test_${newWorker.id}`]);
    module.on('close', (code) => {
      console.log(`모듈 컴파일 완료 (${code})`);

      const exe = spawn(`./test_${newWorker.id}`);
      moduleProcesses[newWorker.id] = {
        process: exe,
        name: `test_${newWorker.id}`
      };

      exe.stdout.on('data', (data) => {
        console.log(`stdout: ${data}, ${newWorker.id}`);
      });
      exe.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      exe.on('close', (code) => {
        console.log(`모듈 실행 완료 (${code})`);
        delete moduleProcesses[newWorker.id];
      });

      console.log(`Worker ${newWorker.id} added`);
      console.log(moduleProcesses);
      res.redirect('/');
    });
  }
};*/


exports.stop = async (req, res, next) => {
  try {
    const processId = req.params.id;
    console.log(`Exiting process ${processId}`);

    if(moduleProcesses[processId]) {
      moduleProcesses[processId].process.kill();
      delete moduleProcesses[processId];
    }

    res.redirect('/agent');
  } catch (error) {
    console.error(error);
    next(error);
  }
}


const writeIniFile = (configData, name) => {
  const configIni = ini.stringify(configData);

  const configFilePath = `${name}_config.ini`;

  fs.writeFileSync(configFilePath, configIni);
}