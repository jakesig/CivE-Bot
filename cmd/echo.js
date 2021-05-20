const Discord = require('discord.js');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
  if (!perms)
      return;

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

module.exports = func;