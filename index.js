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
const ping = require('./cmd/ping.js');

//Variables

const client = new Discord.Client();
let autoresponses = new Map();
let roles = new Map();
let userID = "371052099850469377";
let online = 0;
let status = '';
let token = '';

//Functions

keepAlive();
log(client);

//Reads the autoresponses in the file auto.txt.

fs.readFile('auto.txt', 'utf8', function(err, data) {
  if (err) throw err;
  const responses = data.split("\n");
  for (i = 0; i < responses.length; i++) {
    const args = responses[i].split("/");
    autoresponses.set(args[0], args[1]);
  }
});

//Read users for Rolepersist

fs.readFile('roles.txt', 'utf8', function(err, data) {
  if (err) throw err;
  const responses = data.split("\n");
  for (i = 0; i < responses.length; i++) {
    const args = responses[i].split("/");
    roles.set(args[0], args[1]);
  }
});

//Reads status from file

fs.readFile('status.txt', 'utf8', function(err, data) {
  if (err) throw err;
  status += data;
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
  const memberCountChannel = client.channels.cache.get("844736967635238932");
  let memberCount = guild.memberCount-2;
  memberCountChannel.setName("Member Count: " + memberCount);

  const onlineCountChannel = client.channels.cache.get("844827563045552128");
  let onlineCount = (guild.members.cache.filter(member => member.presence.status !== "offline").size)-2;
  onlineCountChannel.setName("Members Online: " + onlineCount);

});

//Updates online members when a presence updates.

client.on('presenceUpdate', (oldPr, newPr) => {
  if (newPr.member.user.bot)
    return;

  const guild = client.guilds.cache.get("810647926107275294");
  const onlineCountChannel = client.channels.cache.get("844827563045552128");
  let onlineCount = (guild.members.cache.filter(member => member.presence.status !== "offline").size)-2;

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

  //Checks if the bot sent the message

  if (msg.author.bot) {
    return;
  }

  //Boolean that determines if a member has Admin permissions.

  if (msg.member) {
    var perms = !(!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot);
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

  //Autoresponses

  if (msg.channel.name == "mod-chat"
    || msg.channel.name == "mod-review"
    || msg.channel.name == "announcements")
    return;

  for (let key of autoresponses.keys())
    if (msg.content.includes(key) && !msg.author.bot && !msg.content.startsWith("!"))
      msg.channel.send(autoresponses.get(key));

});