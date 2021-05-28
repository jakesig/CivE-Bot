const Discord = require('discord.js');

function func(client, msg, userID) {

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Bot pinged')
    .setDescription("**User: **<@"+msg.author.id+">\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("Bot was pinged!\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Replying to user who pinged

  msg.reply('pong!');

  return;
}

module.exports = func;