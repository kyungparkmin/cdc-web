const { Agent } = require('../models');
const fs = require('fs');
const ini = require('ini');
const {config} = require("dotenv");

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
    // Find the agent by id
    const agent = await Agent.findOne({ where: { id: req.params.id } });

    console.log(agent);

    if (!agent) {
      // If the agent is not found, return an error
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

const writeIniFile = (configData, name) => {
  const configIni = ini.stringify(configData);

  const configFilePath = `${name}_config.ini`;

  fs.writeFileSync(configFilePath, configIni);
}