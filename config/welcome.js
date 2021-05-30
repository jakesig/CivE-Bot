/* welcome.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that processes a new user added.
*/

const Discord = require('discord.js');

function welcome(client, member, roles) {
  
  //Check if bot

  if (member.bot)
    return;

  //Roles  

  const pend = member.guild.roles.cache.find(role => role.name === "Pending Mod Review");
  const civ = member.guild.roles.cache.find(role => role.name === "Civil Engineer");
  const spec = member.guild.roles.cache.find(role => role.name === "Spectator");
  const ben = member.guild.roles.cache.find(role => role.name === "not ben");
  const mod = member.guild.roles.cache.find(role => role.name === "Moderator");

  //Ben

  if (roles.get(member.id) == "Ben") {
    member.setNickname("not ben");
    member.roles.add(spec);
    member.roles.add(ben);
  }

  //Ruman and Sohaib

  else if (roles.get(member.id) == "Ruman" || roles.get(member.id) == "Sohaib" || roles.get(member.id) == "Eytan") {
    member.roles.add(spec);
  }

  //Josh

  else if (roles.get(member.id) == "Josh") {
    member.roles.add(civ);
  }

  //Everyone else

  else {
    member.roles.add(pend);
    member.guild.channels.cache.find(i => i.name === "mod-chat").send("<@"+member.user.id+"> has joined. "+"<@&"+mod.id+"> please assign a role.");
  }

  //Welcome message

  const embed = new Discord.MessageEmbed()
    .setColor('#c28080')
    .setTitle('Welcome ' + member.user.username + '!')
    .setDescription('Welcome to the CivE 2024 server ' + member.user.username + '! Please wait for a moderator to review your profile.')
    .setTimestamp();

  member.guild.channels.cache.find(i => i.name === "welcome").send(embed);
}

module.exports = welcome;