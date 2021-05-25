const Discord = require('discord.js');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
  //Checking for permissions

  if (!perms)
    return;

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Echo used')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Delete invocation and determine channel to echo in

  msg.channel.bulkDelete(1);

  var args = msg.content.substring(1).split(" ");
  let write = new String(args[2]);

  if (!msg.guild.channels.cache.find(i => i.name === args[1])) {
    msg.reply("Invalid channel!");
    return;
  }

  //Perform the echo

  if (args.length > 3) {
    for (var i = 3; i < args.length; i++) {
      write += " " + args[i];
    }
    msg.guild.channels.cache.find(i => i.name === args[1]).send(write);
    return;
  }
  msg.guild.channels.cache.find(i => i.name === args[1]).send(args[2]);
  return;
}

module.exports = func;