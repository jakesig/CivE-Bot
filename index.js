/* index.js
** CivE Bot
** Author: Jake Sigman
** This file contains the primary code for operating the bot, utilizing the entire config folder.
*/

//Library Imports

const Discord = require('discord.js');
const fs = require('fs');

//Variables

const client = new Discord.Client();
let config = new Discord.Collection();
let autoresponses = new Map();
let roles = new Map();
let userID = '';
let online = 0;

console.log = function(){};

//Local Imports

const cmd = require ('./cmd/cmd.js');

const config_files = fs.readdirSync('./config').filter(file => file.endsWith('.js'));
for (const file of config_files) {
  const configFile = require(`./config/${file}`);
  config.set(configFile.name.toLowerCase(), configFile);
  console.info(`Loaded config file ${file}`);
}

//Functions

config.get('keepalive')(); //Keeps bot alive
config.get('init')(client, autoresponses, roles, userID); //Initialization code
config.get('messagehandler')(client, autoresponses, userID); //Message handler
config.get('log')(client); //Logging

//Updates online members when a presence updates

client.on('presenceUpdate', (oldPr, newPr) => {
  config.get('onlinecount')(client, oldPr, newPr, online);
});

//On rate limit

client.on('rateLimit', (info) => {
  console.info("Rate Limit Alert: " + info.timeout/1000 + " s");
  if (info.timeout > 1000) {
    setTimeout(() => {}, info.timeout);
    config.get('onlinecount')(client);
    console.info("Timeout expired. Channel name change attempted.");
  }
});

//On member add

client.on('guildMemberAdd', member => {
  config.get('welcome')(client, member, roles);
  config.get('membercount')(client, member.guild);
});

//On member remove

client.on('guildMemberRemove', member => {
  config.get('membercount')(client, member.guild);
});