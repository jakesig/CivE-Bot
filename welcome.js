const Discord = require('discord.js');

function func(client, member, roles) {
  
  //Check if bot

  if (member.bot)
    return;

  //Update member count
  
  const guild = client.guilds.cache.get("810647926107275294");
  var memberCountChannel = client.channels.cache.get("844736967635238932");
  var memberCount = guild.memberCount-2;
  memberCountChannel.setName("Member Count: " + memberCount);

  //Roles  

  var pend = member.guild.roles.cache.find(role => role.name === "Pending Mod Review");
  var civ = member.guild.roles.cache.find(role => role.name === "Civil Engineer");
  var spec = member.guild.roles.cache.find(role => role.name === "Spectator");
  var ben = member.guild.roles.cache.find(role => role.name === "not ben");
  var mod = member.guild.roles.cache.find(role => role.name === "Moderator");

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

module.exports = func;