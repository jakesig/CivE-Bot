const Discord = require('discord.js');
const fs = require('fs');

function func(client, msg, perms, autoresponses, userID) {
  
  //Checking for permissions

  if (!perms)
    return;

  //Variables

  const args = msg.content.substring(1).split(" ");
  const write = new String("\n" + args[1] + "/" + args[2]);

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Autoresponse added')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Delete invocation

  msg.channel.bulkDelete(1);

  //Embed construction

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Autoresponse added!')
    .setDescription('**Prompt: **' + args[1] + "\n**Response: **" + args[2])
    .setTimestamp();
  
  //Storing in file and adding to map

  if (args.length > 3) {
    for (i = 3; i < args.length; i++) {
      write += " " + args[i];
    }
    const key = write.split("/");
    embed.setDescription('**Prompt: **' + args[1] + "\n**Response: **" + key[1]);
    msg.channel.send(embed);
    client.users.cache.get(userID).send(embed);
    fs.appendFile('auto.txt', write, 'utf8', (err) => {
      if (err) throw err;
    });
    autoresponses.set(args[1], key[1]);
    return;
  }

  fs.appendFile('auto.txt', write, 'utf8', (err) => {
    if (err) throw err;
  });

  msg.channel.send(embed);
  autoresponses.set(args[1], args[2]);
  return;
}

module.exports = func;