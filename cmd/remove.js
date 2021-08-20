/* remove.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that removes an autoresponse.
*/

const Discord = require('discord.js');
const fs = require('fs');

function remove(client, msg, perms, autoresponses, userID) {

  //Checking for permissions

  if (!perms)
    return;

  //Variables

  const args = msg.content.substring(1).split(" ");
  var write = new String();
  var section = "";

  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Autoresponse added')
    .setDescription("**User: **<@"+msg.author.id+"> \n**Command: **"+msg.content+"\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);
  
  if (userID)
    client.users.cache.get(userID).send("**Command Ran: **" + msg.content + "\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);

  //Delete invocation and check if arguments are provided.

  msg.channel.bulkDelete(1);
  
  if (!args[1] || autoresponses[args[1].toLowerCase()])
    return msg.reply("invalid arguments!");

  fs.readFile('init.txt', 'utf8', function(err, data) {
    if (err) throw err;
    const lines = data.split("\n");

    //Reads any autorole and autoresponse information needed
    
    for (i = 0; i < lines.length; i++) {

      if (lines[i] == "")
        continue;

      if (lines[i] == "AUTORESPONSES")
        section = "AUTORESPONSES";

      else if (section == "AUTORESPONSES" && (lines[i].split("/")[0] == args[1] || lines[i] == ""))
        continue;

      write = write + lines[i] + "\n";

    }

    //Writing new init.txt file

    fs.writeFileSync('init.txt', write, 'utf8', (err) => {
      if (err) throw err;
    });

  });

  //Embed construction

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Autoresponse removed!')
    .setDescription('**Prompt: **' + args[1] + "\n**Response: **" + autoresponses.get(args[1]))
    .setThumbnail("https://github.com/jakesig/CivE-Bot/blob/master/share/bot%20icon.png?raw=true")
    .setTimestamp();

  //Send embed and remove autoresponse from map

  msg.channel.send(embed);
  autoresponses.delete(args[1].toLowerCase());
}

module.exports = remove;