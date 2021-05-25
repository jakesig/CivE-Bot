//Library Imports

const Discord = require('discord.js');
const fs = require('fs');

//Local Imports

const keepAlive = require('./server.js');
const log = require('./log.js');
const welcome = require('./welcome.js');

//Command Imports

const echo = require('./cmd/echo.js');
const autoresponse = require('./cmd/autoresponse.js');
const help = require('./cmd/help.js');
const ban = require('./cmd/ban.js');
const git = require('./cmd/git.js');
const kick = require('./cmd/kick.js');
const purge = require('./cmd/purge.js');
const verify = require('./cmd/verify.js');
const rolelist = require('./cmd/rolelist.js');
const specverify = require('./cmd/specverify.js');
const setstatus = require('./cmd/setstatus.js');
const poll = require('./cmd/poll.js');

//Variables

const client = new Discord.Client();
let autoresponses = new Map();
let roles = new Map();
let userID = "371052099850469377";
var online = 0;
var status;
var token='';

//Functions

keepAlive();
log(client);

//Reads the autoresponses in the file auto.txt.

fs.readFile('auto.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var responses = data.split("\n");
  for (i = 0; i < responses.length; i++) {
    var args = responses[i].split("/");
    autoresponses.set(args[0], args[1]);
  }
});

//Read users for Rolepersist

fs.readFile('roles.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var responses = data.split("\n");
  for (i = 0; i < responses.length; i++) {
    var args = responses[i].split("/");
    roles.set(args[0], args[1]);
  }
});

//Reads status from file

fs.readFile('status.txt', 'utf8', function(err, data) {
  if (err) throw err;
  status = data;
});

//Reads token from file and logs in the bot

fs.readFile('token.txt', 'utf8', function(err, data) {
  if (err) throw err;
  token += data;
  client.login(token);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(status);
  client.users.cache.get(userID).send("The bot is alive!");

  //Keeps track of member count and members online.

  const guild = client.guilds.cache.get("810647926107275294");
  var memberCountChannel = client.channels.cache.get("844736967635238932");
  var memberCount = guild.memberCount-2;
  memberCountChannel.setName("Member Count: " + memberCount);

  var onlineCountChannel = client.channels.cache.get("844827563045552128");
  var onlineCount = (guild.members.cache.filter(member => member.presence.status !== "offline").size)-2;
  onlineCountChannel.setName("Members Online: " + onlineCount);

});

//Updates online members when a presence updates.

client.on('presenceUpdate', (oldPr, newPr) => {
  if (newPr.member.user.bot)
    return;

  const guild = client.guilds.cache.get("810647926107275294");
  var onlineCountChannel = client.channels.cache.get("844827563045552128");
  var onlineCount = (guild.members.cache.filter(member => member.presence.status !== "offline").size)-2;

  if ((online != onlineCount) && (oldPr) && oldPr.status != newPr.status && (oldPr.status == "offline" || newPr.status == "offline")) {
    onlineCountChannel.setName("Members Online: " + onlineCount);
    online = onlineCount;
  }
});

//Check if rate limit

client.on('rateLimit', (info) => {
  console.log(info.timeout);
});

//On member add

client.on('guildMemberAdd', member => {
  welcome(client, member, roles);
});

//Message handler

client.on('message', msg => {

  //Handles DMs

  if (msg.channel.type == "dm" && !msg.author.bot) {
    console.log(msg.author.username + ": " + msg.content);
    msg.author.send("Hello! I do not accept direct messages. Please contact my owner, Jake.").catch(error => { });
    return;
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

  //Commands

  //!ping: Pings the bot.

  if (msg.content === '!ping' && !msg.author.bot) {
    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Bot pinged')
      .setDescription("**User: **<@"+msg.author.id+">\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("Bot was pinged!\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
    msg.reply('pong!');
    return;
  }

  //!git: Returns git repository information.

  if (msg.content=="!git" && !msg.author.bot) {
    git(client, msg, perms);
  }

  //!help: Prints out helpful information.

  if (msg.content === '!help' && !msg.author.bot) {
    help(client, msg, perms);
  }

  //!poll: Sends message with reactions for a poll.

  if (msg.content.startsWith('!poll') && !msg.author.bot) {
    poll(client, msg, perms);
  }

  //!rolelist: Lists members with given role.

  if (msg.content.startsWith('!rolelist') && !msg.author.bot) {
    rolelist(client, msg, perms);
  }

  //Boolean that determines if a member has Admin permissions.

  if (msg.member)
    var perms = !(!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot);

  //!setstatus: Sets the status of the bot.

  if (msg.content.startsWith('!setstatus') && !msg.author.bot) {
    setstatus(client, msg, perms);
  }

  //!autoresponse: Adds autoresponse to bot.

  if (msg.content.startsWith('!autoresponse') && !msg.author.bot) {
    autoresponse(client, msg, perms, autoresponses);
  }

  //!echo: Echoes in provided channel.

  if (msg.content.startsWith('!echo') && !msg.author.bot) {
    echo(client, msg, perms);
  }

  //!purge: Bulk deletes specified number of messages.

  if (msg.content.startsWith('!purge')) {
    purge(client, msg, perms);
  }

  //!verify: Verifies user, giving them the Civil Engineer Role.

  if (msg.content.startsWith('!verify') && !msg.author.bot) {
    verify(client, msg, perms);
  }

  //!specverify: Verifies user, giving them the Spectator Role.

  if (msg.content.startsWith('!specverify') && !msg.author.bot) {
    specverify(client, msg, perms);
  }

  //!kick: Kicks specified user.

  if (msg.content.startsWith('!kick') && !msg.author.bot) {
    kick(client, msg, perms);
  }

  //!ban: Bans specified user.

  if (msg.content.startsWith('!ban') && !msg.author.bot) {
    ban(client, msg, perms);
  }

  //Autoresponses

  if (msg.channel.name == "mod-chat"
    || msg.channel.name == "mod-review"
    || msg.channel.name == "announcements")
    return;

  for (let key of autoresponses.keys())
    if (msg.content.includes(key) && !msg.author.bot && !msg.content.startsWith("!"))
      msg.channel.send(autoresponses.get(key));

});