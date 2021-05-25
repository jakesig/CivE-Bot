const Discord = require('discord.js');
var fs = require('fs');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
  //Checking for permissions

  if (!perms)
    return;

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Status set')
    .setDescription("**User: **<@"+msg.author.id+"> \n**New status: **Playing **"+userstatus+"**"+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Delete invocation, determine status to set

  msg.channel.bulkDelete(1);
  var userstatus = msg.content.substring(11);
  
  //Embed construction

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Status set!')
    .setDescription("**New status: **Playing **"+userstatus+"**")
    .setTimestamp();

  msg.channel.send(embed);

  //Save the status in case the bot reboots

  fs.writeFileSync('status.txt', userstatus, 'utf8', (err) => {
      if (err) throw err;
  });

  client.user.setActivity(userstatus);
      
}

module.exports = func;