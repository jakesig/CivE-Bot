const Discord = require('discord.js');
let userID = "371052099850469377";

function func(client, msg, perms) {
  
  if (!perms)
      return;

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

module.exports = func;