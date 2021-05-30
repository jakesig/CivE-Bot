/* cmd.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function for command processing.
*/

const Discord = require('discord.js');

//Command Imports

const echo = require('./echo.js');
const autoresponse = require('./autoresponse.js');
const help = require('./help.js');
const ban = require('./ban.js');
const git = require('./git.js');
const kick = require('./kick.js');
const purge = require('./purge.js');
const verify = require('./verify.js');
const rolelist = require('./rolelist.js');
const specverify = require('./specverify.js');
const setstatus = require('./setstatus.js');
const poll = require('./poll.js');
const ping = require('./ping.js');

function func(client, msg, perms, autoresponses, userID) {
  switch (msg.content.split(" ")[0]) {

    //!git: Returns git repository information.

    case "!git":
      git(client, msg, userID);
      return;

    //!help: Prints out helpful information.

    case "!help":
      help(client, msg, userID);
      return;

    //!ping: Pings the bot.

    case "!ping":
      ping(client, msg, userID);
      return;
    
    //!poll: Sends message with reactions for a poll.

    case "!poll":
      poll(client, msg, userID);
      return;
    
    //!echo: Echoes in provided channel.

    case "!echo":
      echo(client, msg, perms, userID);
      return;

    //!kick: Kicks specified user.

    case "!kick":
      kick(client, msg, perms, userID);
      return;

    //!ban: Bans specified user.

    case "!ban":
      ban(client, msg, perms, userID);
      return;

    //!rolelist: Lists members with given role.

    case "!rolelist":
      rolelist(client, msg, perms, userID);
      return;

    //!setstatus: Sets the status of the bot.

    case "!setstatus":
      setstatus(client, msg, perms, userID);
      return;

    //!autoresponse: Adds autoresponse to bot.

    case "!autoresponse":
      autoresponse(client, msg, perms, autoresponses, userID);
      return;

    //!purge: Bulk deletes specified number of messages.

    case "!purge":
      purge(client, msg, perms, userID);
      return;

    //!verify: Verifies user, giving them the Civil Engineer Role.

    case "!verify":
      verify(client, msg, perms, userID);
      return;

    //!specverify: Verifies user, giving them the Spectator Role.

    case "!specverify":
      specverify(client, msg, perms, userID);
      return;

    //Default case

    default:
      break;
  }
}

module.exports = func;