/* poll.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that sends a poll.
*/

const Discord = require('discord.js');

function func(client, msg, userID) {

  //Variables

  const args = msg.content.substring(6).split("\"");
  const nums = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
  let responses="";

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Poll used')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Delete invocation

  msg.channel.bulkDelete(1);

  //Ridding the argument array of any spaces or empty characters

  for (var i = 0; i < args.length; i++)
    if (args[i]==" " || args[i]=="")
      args.splice(i,1);

  //Checking if too little or too many arguments

  if (args.length > 11) {
    msg.reply("too many arguments!");
    return;
  }

  if (args.length < 3) {
    msg.reply("too little arguments!");
    return;
  }

  //Embed construction

  for (var i = 1; i < args.length; i++)
    responses+=nums[i]+"   "+args[i]+"\n";

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle(args[0])
    .setDescription(responses)
    .setTimestamp();

  //Embed reaction

  msg.channel.send({embed: embed}).then(embed => {
    for (var i = 0; i < args.length-1; i++)
      embed.react(nums[i+1]);
  });
}

module.exports = func;