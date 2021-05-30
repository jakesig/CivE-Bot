/* git.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function displays GitHub information.
*/

const Discord = require('discord.js');
const git = require('git-last-commit');

function gitinfo(client, msg, userID) {
  
  //Logging

  const msgembed = new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setTitle('Git info requested')
    .setDescription("**User: **<@"+msg.author.id+">\n**Channel: **"+msg.channel.name)
    .setTimestamp();

  msg.guild.channels.cache.find(i => i.name === "action-log").send(msgembed);

  if (userID) {
    client.users.cache.get(userID).send("Git Info Requested!\n**User: **" + msg.author.username + "\n**Channel: **" + msg.channel.name);
  }

  //Send embed with name of latest commit

  var commitname=git.getLastCommit(function(err, commit) {
    if (err)
      throw err;
    msg.channel.bulkDelete(1);

    //Determine commit information, including the date

    var commitid=Object.values(commit)[1]
    var name=Object.values(commit)[2];
    var branch=Object.values(commit)[10];
    var s = new Date(Object.values(commit)[6]*1000).toLocaleDateString("en-US", {timeZone: "America/New_York"});

    //Construct and send embed

    const embed = new Discord.MessageEmbed()
      .setColor('#c28080')
      .setTitle("GitHub Repository: jakesig/CivE-Bot")
      .setDescription("https://github.com/jakesig/CivE-Bot\n\n__**Latest Commit**__\n**Message: **"+name+"\n**Branch: **"+branch+"\n**Date: **"+s+"\n**ID: **"+commitid)
      .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAi68fw3hBkE6l-vGLWYB9aRoSV5DWJ0zKJtAzpjYTMD83DwP5WU4D1N7eHx1ucPcZle8&usqp=CAU");
    msg.channel.send(embed);
  });

  return;
}

module.exports = gitinfo;