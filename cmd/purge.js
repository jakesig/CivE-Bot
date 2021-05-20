const Discord = require('discord.js');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
  if (!perms)
      return;

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

module.exports = func;