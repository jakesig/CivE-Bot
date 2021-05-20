
const Discord = require('discord.js');
var git = require('git-last-commit');
var fs = require('fs');

const keepAlive = require('./server.js');
const log = require('./log.js');
const echo = require('./cmd/echo.js');
const ban = require('./cmd/ban.js');
const kick = require('./cmd/kick.js');
const purge = require('./cmd/purge.js');
const verify = require('./cmd/verify.js');
const specverify = require('./cmd/specverify.js');
const setstatus = require('./cmd/setstatus.js');

const client = new Discord.Client();
let autoresponses = new Map();
let roles = new Map();
let userID = "371052099850469377";
var online = 0;
var status;
var token='';

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
  console.err(info.timeout);
});

//On member add

client.on('guildMemberAdd', member => {

  //Check if bot

  if (member.bot)
    return;

  //Update member count
  
  const guild = client.guilds.cache.get("810647926107275294");
  var memberCountChannel = client.channels.cache.get("844736967635238932");
  var memberCount = guild.memberCount-2;
  memberCountChannel.setName("Member Count: " + memberCount);

  //Roles  

  var pend = member.guild.roles.cache.find(role => role.name === "Pending Mod Review");
  var civ = member.guild.roles.cache.find(role => role.name === "Civil Engineer");
  var spec = member.guild.roles.cache.find(role => role.name === "Spectator");
  var ben = member.guild.roles.cache.find(role => role.name === "not ben");
  var mod = member.guild.roles.cache.find(role => role.name === "Moderator");

  //Ben

  if (roles.get(member.id) == "Ben") {
    member.setNickname("not ben");
    member.roles.add(spec);
    member.roles.add(ben);
  }

  //Ruman and Sohaib

  else if (roles.get(member.id) == "Ruman" || roles.get(member.id) == "Sohaib" || roles.get(member.id) == "Eytan") {
    member.roles.add(spec);
  }

  //Josh

  else if (roles.get(member.id) == "Josh") {
    member.roles.add(civ);
  }

  //Everyone else

  else {
    member.roles.add(pend);
    member.guild.channels.cache.find(i => i.name === "mod-chat").send("<@"+member.user.id+"> has joined. "+"<@&"+mod.id+"> please assign a role.");
  }

  //Welcome message

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Welcome ' + member.user.username + '!')
    .setDescription('Welcome to the CivE 2024 server ' + member.user.username + '! Please wait for a moderator to review your profile.')
    .setTimestamp();

  member.guild.channels.cache.find(i => i.name === "welcome").send(embed);
  
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

    //Send embed with name of latest commit

    var commitname=git.getLastCommit(function(err, commit) {
      if (err)
        throw err;
      msg.channel.bulkDelete(1);

      //Determine commit information, including the date

      var commitid=Object.values(commit)[1]
      var name=Object.values(commit)[2];
      var branch=Object.values(commit)[10];
      var s = new Date(Object.values(commit)[6]*1000).toLocaleDateString("en-US", {timeZone: "America/New_York"});

      //Construct and send embed

      const embed = new Discord.MessageEmbed()
        .setColor('#c28080')
        .setTitle("GitHub Repository: jakesig/CivE-Bot")
        .setDescription("https://github.com/jakesig/CivE-Bot\n\n__**Latest Commit**__\n**Message: **"+name+"\n**Branch: **"+branch+"\n**Date: **"+s+"\n**ID: **"+commitid)
        .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAi68fw3hBkE6l-vGLWYB9aRoSV5DWJ0zKJtAzpjYTMD83DwP5WU4D1N7eHx1ucPcZle8&usqp=CAU");
      msg.channel.send(embed);
    });

    //Logging

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Git info requested')
      .setDescription("**User: **<@"+msg.author.id+">\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("Git Info Requested!\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    return;
  }

  //!help: Prints out helpful information.

  if (msg.content === '!help' && !msg.author.bot) {

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Help requested')
      .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
    msg.channel.bulkDelete(1);

    msg.channel.startTyping();

    const mod_embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('CivE Bot List of Commands')
      .setDescription(`!help: *Opens this menu.*
      !ping: *Pings the bot.*
      !git: *Returns git repository information.*
      !kick {@member}: *Kicks member with name member.*
      !ban {@member}: *Bans member with name member.*
      !purge {number}: *Bulk deletes number of messages specified.*
      !echo {channel-name} {message}: *Echoes message in channel specified.*
      !autoresponse {prompt} {response}: *Adds autoresponse to bot.*
      !verify {@member}: *Assigns Civil Engineering role to member.*
      !specverify {@member}: *Assigns Spectator role to member.*
      !setstatus {status}: *Sets the status of the bot.*
      !rolelist {role-name}: *Lists members with role name specified.*`)
      .setTimestamp();

    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('CivE Bot List of Commands')
      .setDescription(`!help: *Opens this menu.*
      !git: *Returns git repository information.*
      !ping: *Pings the bot.*
      !rolelist {role-name}: *Lists members with role name specified.*`)
      .setTimestamp();

    msg.channel.stopTyping();

    if (msg.channel.name === 'mod-chat' || msg.channel.name === 'mod-log') {
      msg.channel.send(mod_embed);
      return;
    }

    else {
      msg.channel.send(embed);
      return;
    }
  }

  //!rolelist: Lists members with given role.

  if (msg.content.startsWith('!rolelist') && !msg.author.bot) {
    var rolename = msg.content.substring(10);
    var role = msg.guild.roles.cache.find(role => role.name === rolename);

    msg.channel.bulkDelete(1);

    if(!role) {
      msg.reply('that role does not exist!');
      return;
    }

    //Logging

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Role list requested')
      .setDescription("**User: **<@"+msg.author.id+"> \n**Role: **"+rolename+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    //Gather members and send list of them.

    let arr = new Array();
    role.members.forEach(user => {
      arr.push(`${user.user.username}`);
    });

    const embed = new Discord.MessageEmbed()
      .setColor(role.hexColor)
      .setTitle(`Members with role "`+rolename+`"`)
      .setDescription(arr.join('\n'))
      .setTimestamp();

    msg.channel.send(embed);
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
    if (!perms)
      return;

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Autoresponse added')
      .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    msg.channel.bulkDelete(1);

    var args = msg.content.substring(1).split(" ");
    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('Autoresponse added!')
      .setDescription('**Prompt: **' + args[1] + "\n**Response: **" + args[2])
      .setTimestamp();
    let write = new String("\n" + args[1] + "/" + args[2]);

    if (args.length > 3) {
      for (i = 3; i < args.length; i++) {
        write += " " + args[i];
      }
      var key = write.split("/");
      embed.setDescription('**Prompt: **' + args[1] + "\n**Response: **" + key[1]);
      msg.channel.send(embed);
      client.users.cache.get(userID).send(embed);
      fs.appendFile('auto.txt', write, 'utf8', (err) => {
        if (err) throw err;
      });
      autoresponses.set(args[1], key[1]);
      return;
    }

    fs.appendFile('auto.txt', write, 'utf8', (err) => {
      if (err) throw err;
    });

    msg.channel.send(embed);
    //client.users.cache.get(userID).send(embed);
    autoresponses.set(args[1], args[2]);
    return;
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
    if (msg.content.includes(key) && !msg.author.bot)
      msg.channel.send(autoresponses.get(key));

});