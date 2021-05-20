function func() {
  const Discord = require('discord.js');
  const git = require('git-last-commit');
  const fs = require('fs');

  const keepAlive = require('./server.js');
  const log = require('./log.js');
  const welcome = require('./welcome.js');

  const echo = require('./cmd/echo.js');
  const help = require('./cmd/help.js');
  const ban = require('./cmd/ban.js');
  const kick = require('./cmd/kick.js');
  const purge = require('./cmd/purge.js');
  const verify = require('./cmd/verify.js');
  const specverify = require('./cmd/specverify.js');
  const setstatus = require('./cmd/setstatus.js');
}

module.exports = func;