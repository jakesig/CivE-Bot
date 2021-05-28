//Library Imports

const Discord = require('discord.js');
const fs = require('fs');

//Local Imports

const log = require('./log.js');
const cmd = require ('./cmd/cmd.js');
const welcome = require('./welcome.js');
const keepAlive = require('./server.js');

//Variables

const client = new Discord.Client();
let autoresponses = new Map();
let roles = new Map();
let userID = '';
let status = '';
let token = '';
let online = 0;
let perms = false;

//Functions

keepAlive();
log(client);


//Reads initialization information

fs.readFile('init.txt', 'utf8', function(err, data) {
  if (err) throw err;
  const lines = data.split("\n");

  //Determines user for logging and token, then logs in the bot

  userID += lines[0].split(': ')[1];
  token += lines[1].split(': ')[1];
  client.login(token);

  //Reads any autorole and autoresponse information needed
  
  let section = "AUTOROLES";
  for (i = 4; i < lines.length; i++) {
    let args = lines[i].split("/");

    //Confirms the section of the file being read

    if (args[0] == "") {
      section = "AUTORESPONSES";
      i += 2;
      args = lines[i].split("/");
    }

    //If reading autoroles, add to roles map

    if (section == "AUTOROLES") {
      roles.set(args[0], args[1]);
    }

    //If reading autoresponses, add to autoresponses map

    else if (section == "AUTORESPONSES") {
      autoresponses.set(args[0], args[1]);
    }
  }
});

//Reads status from file

fs.readFile('status.txt', 'utf8', function(err, data) {
  if (err) throw err;
  status += data;
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