const Discord = require('discord.js');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
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

module.exports = func;