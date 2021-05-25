const Discord = require('discord.js');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
  //Checking for permissions

  if (!perms)
    return;

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Moderator command used')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Determine amount of messages to remove and remove them

  var args = msg.content.substring(1).split(" ");
  let messagecount = parseInt(args[1]) + 1;

  msg.channel.bulkDelete(messagecount).catch(err => {
    msg.channel.send(`Error in purging, try again in a bit.`);
  });
  return;
}

module.exports = func;