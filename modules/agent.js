const { Agent } = require('../models');
const fs = require('fs');
const ini = require('ini');
const { spawn } = require('child_process');

let moduleProcesses = {}; // 모듈을 추적하기 위한 객체

exports.create = async (req, res, next) => {
  const { export_log_path, name, path, port, topic, username, table, target_ip, target_port, target_name, target_password } = req.body;
  try {
    await Agent.create({ name, path, port, topic, username, table, target_ip, target_port, target_name, target_password, UserId: req.user.id });

    const configData = {
      'export-log-path': export_log_path,
      'kafka-ip': path,
      'kafka-port': port,
      'kafka-topic': topic,
      'source-db-user': username,
      'source-db-table': table,
      'target-db-ip': target_ip,
      'target-db-port': target_port,
      'target-db-name': target_name,
      'target-db-password': target_password,
    };

    writeIniFile(configData, name);

    res.send('<script>alert("등록되었습니다"); location.href="/agent" </script>')
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.modify = async (req, res, next) => {
  const { export_log_path, name, path, port, topic, username, table, target_ip, target_port, target_name, target_password } = req.body;
  try {
    const agent = await Agent.findByPk(req.params.id);

    if (!agent) {
      return res.status(404).send('Agent not found');
    }

    // Update the agent with the new data
    await agent.update({ name, path, port, topic, username, table, target_ip, target_port, target_name, target_password });

    const configData = {
      'export-log-path': export_log_path,
      'kafka-ip': path,
      'kafka-port': port,
      'kafka-topic': topic,
      'source-db-user': username,
      'source-db-table': table,
      'target-db-ip': target_ip,
      'target-db-port': target_port,
      'target-db-name': target_name,
      'target-db-password': target_password,
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


const writeIniFile = (configData, name) => {
  const configIni = ini.stringify(configData);

  const configFilePath = `config.ini`;

  fs.writeFileSync(configFilePath, configIni);
}