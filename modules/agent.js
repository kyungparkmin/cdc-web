const { Agent } = require('../models');
const fs = require('fs');
const ini = require('ini');

exports.create = async (req, res, next) => {
  const { name, path, username, password, database, table } = req.body;
  try {
    await Agent.create({ name, path, username, password, database, table, UserId: req.user.id });

    const configData = {
      'kafka-path': path,
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
  const { name, path, username, password, database, table } = req.body;
  try {
    const agent = await Agent.findByPk(req.params.id);

    if (!agent) {
      return res.status(404).send('Agent not found');
    }

    // Update the agent with the new data
    await agent.update({ name, path, username, password, database, table });

    const configData = {
      'kafka-path': path,
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


const writeIniFile = (configData, name) => {
  const configIni = ini.stringify(configData);

  const configFilePath = `${name}_config.ini`;

  fs.writeFileSync(configFilePath, configIni);
}