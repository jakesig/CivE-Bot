/* index.js
** CivE Bot
** Author: Jake Sigman
** This file contains the primary code for operating the bot.
*/

//Library Imports

const Discord = require('discord.js');

//Local Imports

const log = require('./log.js');
const cmd = require ('./cmd/cmd.js');
const welcome = require('./welcome.js');
const keepAlive = require('./server.js');
const membercount = require('./membercount.js');
const onlinecount = require('./onlinecount.js');
const init = require('./init.js');

//Variables

const client = new Discord.Client();
let autoresponses = new Map();
let roles = new Map();
let userID = '';
let online = 0;
let perms = false;

//Functions

keepAlive();
log(client);

//Reads initialization information and contains code for initialization

init(client, autoresponses, roles, userID);

//Updates online members when a presence updates

client.on('presenceUpdate', (oldPr, newPr) => {onlinecount(client, oldPr, newPr, online);});

//On rate limit

client.on('rateLimit', (info) => {console.log(info.timeout);});

//On member add

client.on('guildMemberAdd', member => {
  welcome(client, member, roles);
  membercount(client, member.guild);
});

//On member remove

client.on('guildMemberRemove', member => {membercount(client, member.guild);})

//Message handler

client.on('message', msg => {

  //Handles DMs

  if (msg.channel.type == "dm" && !msg.author.bot) {
    console.log(msg.author.username + ": " + msg.content);
    msg.author.send("Hello! I do not accept direct messages. Please contact my owner, Jake.").catch(error => { });
    return;
  }

  //Checks if the bot sent the message

  if (msg.author.bot) {
    return;
  }

  //Boolean that determines if a member has Admin permissions.

  if (msg.member) {
    perms = !(!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot);
  }

  //Moderation

  if (msg.content.includes("https://thumbs.gfycat.com/TartAdolescentBird-mobile.mp4")
    || msg.content.includes("https://gfycat.com/wellgroomedoddhalibut")
    || msg.content.includes("https://gfycat.com/wetangryflamingo")
    || msg.content.includes("https://thumbs.gfycat.com/SlipperyBelatedKudu-size_restricted.gif")) {
    msg.channel.bulkDelete(1);
    msg.channel.send("Do not send that GIF in this server!");
    return;
  }

  //Command Processing

  cmd(client, msg, perms, autoresponses, userID);

  //Autoresponses

  if (msg.channel.name == "mod-chat"
    || msg.channel.name == "mod-review"
    || msg.channel.name == "announcements")
    return;

  for (let key of autoresponses.keys())
    if (msg.content.includes(key) && !msg.author.bot && !msg.content.startsWith("!"))
      msg.channel.send(autoresponses.get(key));

});