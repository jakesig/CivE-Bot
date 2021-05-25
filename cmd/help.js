const Discord = require('discord.js');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Help requested')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
  
  //Delete invocation, begin typing

  msg.channel.bulkDelete(1);
  msg.channel.startTyping();

  //Construct two different embeds, depending on the channel

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

module.exports = func;