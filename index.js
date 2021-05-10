const keepAlive = require('./server');
const Discord = require('discord.js');
var git = require('git-last-commit');
var fs = require('fs');
const client = new Discord.Client();
let autoresponses = new Map();
let roles = new Map();
let userID = "371052099850469377";
var status;
var token='';
var ignore=false;

keepAlive();

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
});

//On member add

client.on('guildMemberAdd', member => {

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

  else if (roles.get(member.id) == "Ruman" || roles.get(member.id) == "Sohaib") {
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
      ignore = true;

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
    ignore = true;
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
      !setstatus {status}: *Sets the status of the bot.*`)
      .setTimestamp();

    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('CivE Bot List of Commands')
      .setDescription(`!help: *Opens this menu.*
      !git: *Returns git repository information.*
      !ping: *Pings the bot.*`)
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

  //Boolean that determines if a member has Admin permissions.

  if (msg.member)
    var perms = !(!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot);

  //!setstatus: Sets the status of the bot.

  if (msg.content.startsWith('!setstatus') && !msg.author.bot) {
    if (!perms)
      return;

    ignore = true;

    var userstatus = msg.content.substring(11);
    msg.channel.bulkDelete(1);

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Status set')
      .setDescription("**User: **<@"+msg.author.id+"> \n**New status: **Playing **"+userstatus+"**"+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('Status set!')
      .setDescription("**New status: **Playing **"+userstatus+"**")
      .setTimestamp();

    msg.channel.send(embed);

    fs.writeFileSync('status.txt', userstatus, 'utf8', (err) => {
        if (err) throw err;
    });

    client.user.setActivity(userstatus);
  }

  //!autoresponse: Adds autoresponse to bot.

  if (msg.content.startsWith('!autoresponse') && !msg.author.bot) {
    if (!perms)
      return;

    ignore = true;

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
    client.users.cache.get(userID).send(embed);
    autoresponses.set(args[1], args[2]);
    return;
  }

  //!echo: Echoes in provided channel.

  if (msg.content.startsWith('!echo') && !msg.author.bot) {
    if (!perms)
      return;

    ignore = true;

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Echo used')
      .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    msg.channel.bulkDelete(1);

    var args = msg.content.substring(1).split(" ");
    let write = new String(args[2]);
    var i;

    if (!msg.guild.channels.cache.find(i => i.name === args[1])) {
      msg.reply("Invalid channel!");
      return;
    }

    if (args.length > 3) {
      for (i = 3; i < args.length; i++) {
        write += " " + args[i];
      }
      msg.guild.channels.cache.find(i => i.name === args[1]).send(write);
      return;
    }
    msg.guild.channels.cache.find(i => i.name === args[1]).send(args[2]);
    return;
  }

  //!purge: Bulk deletes specified number of messages.

  if (msg.content.startsWith('!purge')) {
    if (!perms)
      return;

    ignore = true;

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Moderator command used')
      .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    var args = msg.content.substring(1).split(" ");

    let messagecount = parseInt(args[1]) + 1;

    msg.channel.bulkDelete(messagecount).catch(err => {
      msg.channel.send(`You didn't type it correctly, try again.`);
    });
    return;
  }

  //!verify: Verifies user, giving them the Civil Engineer Role.

  if (msg.content.startsWith('!verify') && !msg.author.bot) {
    if (!perms)
      return;

    ignore = true;

    const user = msg.mentions.users.first();

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Member verified')
      .setDescription("**User: **<@"+user.id+">")
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('Verified ' + user.username + "!")
      .setDescription('Civil Engineer role assigned.')
      .setTimestamp();

    var pend = msg.member.guild.roles.cache.find(role => role.name === "Pending Mod Review");
    var civ = msg.member.guild.roles.cache.find(role => role.name === "Civil Engineer");

    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    msg.channel.bulkDelete(1);
    
    if (user) {
      const memb = msg.guild.member(user);
      if (memb) {
        memb.roles.remove(pend);
        memb.roles.add(civ);
        msg.channel.send(embed);
      }
      else
        msg.reply("Can't find user.");
    }
    else
      msg.reply("No user mentioned.");

  }

  //!kick: Kicks specified user.

  if (msg.content.startsWith('!kick') && !msg.author.bot) {
    if (!perms)
      return;

    ignore = true;

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Moderator command used')
      .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    msg.channel.bulkDelete(1);
    const user = msg.mentions.users.first();

    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('Kicked ' + user.username)
      .setDescription('I love kicking.')
      .setTimestamp();

    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member
          .kick('null')
          .then(() => {
            msg.channel.send(embed);
          })
          .catch(err => {
            msg.reply('I was unable to kick the member');
            console.error(err);
          });
      }
      else
        msg.reply("That user isn't in this server!");
    }
    else
      msg.reply("You didn't mention the user to kick!");
    return;
  }

  //!ban: Bans specified user.

  if (msg.content.startsWith('!ban') && !msg.author.bot) {
    if (!perms)
      return;

    ignore = true;

    const msgembed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Moderator command used')
      .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
      .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

    msg.channel.bulkDelete(1);
    const user = msg.mentions.users.first();

    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle('Banned ' + user.username)
      .setDescription('Banning? Even better!')
      .setTimestamp();

    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member.ban({ reason: 'Because I said so.', })
          .then(() => {
            msg.channel.send(embed);
          })
          .catch(err => {
            msg.reply('I was unable to ban the member');
            console.error(err);
          });
      }
      else
        msg.reply("That user isn't in this server!");
    }
    else
      msg.reply("You didn't mention the user to ban!");
    return;
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

//Action Logging

//Member Joined

client.on('guildMemberAdd', member => {
  const embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Member joined')
      .setDescription("**User: **<@"+member.id+"> ")
      .setTimestamp();

  member.guild.channels.cache.find(i => i.name === "action-log").send(embed);
});

//Member Left

client.on('guildMemberRemove', member => {
  const embed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Member left')
      .setDescription("**User: **<@"+member.id+"> ")
      .setTimestamp();

  member.guild.channels.cache.find(i => i.name === "action-log").send(embed);
});

//Member Updated

client.on('guildMemberUpdate', (oldM, newM) => {
  const embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Member updated')
      .setTimestamp();

  if (oldM.displayName!=newM.displayName) {
    embed.setTitle(newM.user.username+"'s nickname was changed!");
    embed.setDescription("**Old Name: **"+oldM.displayName+"\n**New Name: **"+newM.displayName);
    newM.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  else if (oldM.roles.cache!=newM.roles.cache) {
    var oldRoles = "**Old Roles** ";
    var newRoles = "\n\n**New Roles**";
    embed.setTitle(newM.user.username+"'s roles were updated!");
    newM.roles.cache.forEach((r,i) => {
      if (r.name=="@everyone");
      else
        newRoles+="\n"+r.name;
    });
    oldM.roles.cache.forEach((r,i) => {
      if (r.name=="@everyone");
      else 
        oldRoles+="\n"+r.name;
    });
    embed.setDescription(oldRoles+newRoles);
    newM.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }
});

//Message Deleted

client.on('messageDelete', msg => {
  if (msg.author.bot)
    return;

  if (ignore) {
    ignore = false;
    return;
  }

  const embed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Message deleted in #'+msg.channel.name)
      .setDescription("**User: **<@"+msg.member.id+"> "+"\n**Message: **"+msg.content)
      .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(embed);
});

//Message Edited

client.on('messageUpdate', (oldmsg, newmsg) => {
  const embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Message edited in #'+oldmsg.channel.name)
      .setDescription("**User: **<@"+oldmsg.member.id+">\n**Old Message: **"+oldmsg.content+"\n**New Message: **"+newmsg.content)
      .setTimestamp();

  newmsg.guild.channels.cache.find(i => i.name === "action-log").send(embed);
});

//Voice Channels

client.on('voiceStateUpdate', (oldstate, newstate) => {
  const embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTimestamp();

  //Voice Connect

  if (oldstate.channelID==null) {
    embed.setTitle(newstate.member.displayName + " connected");
    embed.setDescription("**Channel: **🔈"+newstate.channel.name);
    oldstate.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  //Voice Disconnect

  else if (newstate.channelID==null) {
    embed.setTitle(newstate.member.displayName + " disconnected");
    embed.setDescription("**Channel: **🔈"+oldstate.channel.name);
    oldstate.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  //Move Channels

  else if (newstate.channelID!=oldstate.channelID) {
    embed.setTitle(newstate.member.displayName + " moved");
    embed.setDescription("**From: **🔈"+oldstate.channel.name+"\n**To: **🔈"+newstate.channel.name);
    oldstate.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  
});

//Member Banned

client.on('guildBanAdd', (guild, member) => {
  const embed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Member banned')
      .setDescription("**User: **"+member.tag)
      .setTimestamp(); 

  guild.channels.cache.find(i => i.name === "action-log").send(embed);
});

//Member Unbanned

client.on('guildBanRemove', (guild,member) => {
  const embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Member unbanned')
      .setDescription("**User: **"+member.tag)
      .setTimestamp();

  guild.channels.cache.find(i => i.name === "action-log").send(embed);
});

//Role Created

client.on('roleCreate', role => {
  const embed = new Discord.MessageEmbed()
      .setColor(role.hexColor)
      .setTitle('Role created')
      .setDescription("**Name: **"+role.name)
      .setTimestamp();
  
  role.guild.channels.cache.find(i => i.name === "action-log").send(embed)
});

//Role Removed

client.on('roleDelete', role => {
  const embed = new Discord.MessageEmbed()
      .setColor(role.hexColor)
      .setTitle('Role deleted')
      .setDescription("**Name: **"+role.name)
      .setTimestamp();
  
  role.guild.channels.cache.find(i => i.name === "action-log").send(embed)
});

//Channel or Category Created

client.on('channelCreate', channel => {
  const embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Channel created')
      .setTimestamp();

  if (channel.type=="text") {
    embed.setDescription("**Name: ** #"+channel.name);
    channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  else if (channel.type=="voice") {
    embed.setDescription("**Name: **🔈 "+channel.name);
    channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  else if (channel.type=="category") {
    embed.setTitle("Category created");
    embed.setDescription("**Name: **"+channel.name);
    channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }
});

//Channel or Category Deleted

client.on('channelDelete', channel => {
  const embed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Channel removed')
      .setTimestamp();

  if (channel.type=="text") {
    embed.setDescription("**Name: ** #"+channel.name);
    channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  else if (channel.type=="voice") {
    embed.setDescription("**Name: **🔈 "+channel.name);
    channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  else if (channel.type=="category") {
    embed.setTitle("Category removed");
    embed.setDescription("**Name: **"+channel.name);
    channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }
});

//Channel or Category Updated

client.on('channelUpdate', (oldCh, newCh) => {
  const embed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Channel modified')
      .setTimestamp();

  if (oldCh.type=="text") {
    embed.setDescription("**Old Channel: ** #"+oldCh.name+"\n**New Channel: ** #"+newCh.name);
    newCh.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  else if (oldCh.type=="voice") {
    embed.setDescription("**Old Channel: ** 🔈"+oldCh.name+"\n**New Channel: ** 🔈"+newCh.name);
    newCh.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }

  else if (oldCh.type=="category") {
    embed.setTitle("Category modified");
    embed.setDescription("**Old Category: **"+oldCh.name+"\n**New Category: ** 🔈"+newCh.name);
    newCh.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  }
});