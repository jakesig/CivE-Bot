/* cmd.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function for command processing.
** This file utilizes the entire cmd folder.
*/

//Library Imports

const Discord = require('discord.js');
const fs = require('fs');

//Command Imports

let cmd = new Discord.Collection();
const cmd_files = fs.readdirSync('./cmd').filter(file => file != "cmd.js");
for (const file of cmd_files) {
  const cmdFile = require(`./${file}`);
  cmd.set(cmdFile.name.toLowerCase(), cmdFile);
  console.info(`Loaded command file ${file}`);
}

function func(client, msg, perms, autoresponses, userID) {
  switch (msg.content.split(" ")[0]) {
    case "!git": //!git: Returns git repository information.
      cmd.get('gitinfo')(client, msg, userID);
      return;
    case "!help": //!help: Prints out helpful information.
      cmd.get('help')(client, msg, userID);
      return;
    case "!ping": //!ping: Pings the bot.
      cmd.get('ping')(client, msg, userID);
      return;
    case "!poll": //!poll: Sends message with reactions for a poll.
      cmd.get('poll')(client, msg, userID);
      return;
    case "!echo": //!echo: Echoes in provided channel.
      cmd.get('echo')(client, msg, perms, userID);
      return;
    case "!kick": //!kick: Kicks specified user.
      cmd.get('kick')(client, msg, perms, userID);
      return;
    case "!ban": //!ban: Bans specified user.
      cmd.get('ban')(client, msg, perms, userID);
      return;
    case "!rolelist": //!rolelist: Lists members with given role.
      cmd.get('rolelist')(client, msg, perms, userID);
      return;
    case "!setstatus": //!setstatus: Sets the status of the bot.
      cmd.get('setstatus')(client, msg, perms, userID);
      return;
    case "!autoresponse": //!autoresponse: Adds autoresponse to bot.
      cmd.get('autoresponse')(client, msg, perms, autoresponses, userID);
      return;
    case "!purge": //!purge: Bulk deletes specified number of messages.
      cmd.get('purge')(client, msg, perms, userID);
      return;
    case "!verify": //!verify: Verifies user, giving them the Civil Engineer Role.
      cmd.get('verify')(client, msg, perms, userID);
      return;
    case "!specverify": //!specverify: Verifies user, giving them the Spectator Role.
      cmd.get('specverify')(client, msg, perms, userID);
      return;
    case "!remove": //!remove: removes autoresponse
      cmd.get('remove')(client, msg, perms, autoresponses, userID);
      return;
    default: //Default case
      break;
  }
}

module.exports = func;