/* log.js
** CivE Bot
** Author: Jake Sigman
** This file contains a code that keeps track of actions in a guild.
*/

const Discord = require('discord.js');

function log(client) {
  
  //Member Joined

  client.on('guildMemberAdd', member => {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle('Member joined')
        .setDescription("**User: **<@"+member.id+"> ")
        .setTimestamp();

    member.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  });

  //Member Left

  client.on('guildMemberRemove', member => {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Member left')
        .setDescription("**User: **<@"+member.id+"> ")
        .setTimestamp();

    member.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  });

  //Member Updated

  client.on('guildMemberUpdate', (oldM, newM) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ffff')
        .setTitle('Member updated')
        .setTimestamp();

    //Nickname Updated

    if (oldM.displayName!=newM.displayName) {
      embed.setTitle(newM.user.username+"'s nickname was changed!");
      embed.setDescription("**Old Name: **"+oldM.displayName+"\n**New Name: **"+newM.displayName);
      newM.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    //Roles Updated: Not working 

    // else if (oldM.roles.cache!=newM.roles.cache) {
    //   var oldRoles = "**Old Roles** ";
    //   var newRoles = "\n\n**New Roles**";
    //   embed.setTitle(newM.user.username+"'s roles were updated!");
    //   newM.roles.cache.forEach((r,i) => {
    //     if (r.name=="@everyone");
    //     else
    //       newRoles+="\n"+r.name;
    //   });
    //   oldM.roles.cache.forEach((r,i) => {
    //     if (r.name=="@everyone");
    //     else 
    //       oldRoles+="\n"+r.name;
    //   });
    //   embed.setDescription(oldRoles+newRoles);
    //   newM.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    // }
  });

  //Message Deleted

  client.on('messageDelete', msg => {
    if (msg.author.bot)
      return;

    if (msg.content.startsWith("!"))
      return;

    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Message deleted in #'+msg.channel.name)
        .setDescription("**User: **<@"+msg.member.id+"> "+"\n**Message: **"+msg.content)
        .setTimestamp();

    msg.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  });

  //Message Edited

  client.on('messageUpdate', (oldmsg, newmsg) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ffff')
        .setTitle('Message edited in #'+oldmsg.channel.name)
        .setDescription("**User: **<@"+oldmsg.member.id+">\n**Old Message: **"+oldmsg.content+"\n**New Message: **"+newmsg.content)
        .setTimestamp();

    if (oldmsg.content != newmsg.content)
      newmsg.guild.channels.cache.find(i => i.name === "action-log").send(embed);
  });

  //Voice Channels

  client.on('voiceStateUpdate', (oldstate, newstate) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ffff')
        .setTimestamp();

    //Voice Connect

    if (oldstate.channelID==null) {
      embed.setTitle(newstate.member.displayName + " connected");
      embed.setDescription("**Channel: **🔈"+newstate.channel.name);
      oldstate.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    //Voice Disconnect

    else if (newstate.channelID==null) {
      embed.setTitle(newstate.member.displayName + " disconnected");
      embed.setDescription("**Channel: **🔈"+oldstate.channel.name);
      oldstate.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    //Move Channels

    else if (newstate.channelID!=oldstate.channelID) {
      embed.setTitle(newstate.member.displayName + " moved");
      embed.setDescription("**From: **🔈"+oldstate.channel.name+"\n**To: **🔈"+newstate.channel.name);
      oldstate.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }
  });

  //Member Banned

  client.on('guildBanAdd', (guild, member) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Member banned')
        .setDescription("**User: **"+member.tag)
        .setTimestamp(); 

    guild.channels.cache.find(i => i.name === "action-log").send(embed);
  });

  //Member Unbanned

  client.on('guildBanRemove', (guild,member) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle('Member unbanned')
        .setDescription("**User: **"+member.tag)
        .setTimestamp();

    guild.channels.cache.find(i => i.name === "action-log").send(embed);
  });

  //Role Created

  client.on('roleCreate', role => {
    const embed = new Discord.MessageEmbed()
        .setColor(role.hexColor)
        .setTitle('Role created')
        .setDescription("**Name: **"+role.name)
        .setTimestamp();
    
    role.guild.channels.cache.find(i => i.name === "action-log").send(embed)
  });

  //Role Removed

  client.on('roleDelete', role => {
    const embed = new Discord.MessageEmbed()
        .setColor(role.hexColor)
        .setTitle('Role deleted')
        .setDescription("**Name: **"+role.name)
        .setTimestamp();
    
    role.guild.channels.cache.find(i => i.name === "action-log").send(embed)
  });

  //Channel or Category Created

  client.on('channelCreate', channel => {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle('Channel created')
        .setTimestamp();

    if (channel.type=="text") {
      embed.setDescription("**Name: ** #"+channel.name);
      channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    else if (channel.type=="voice") {
      embed.setDescription("**Name: **🔈 "+channel.name);
      channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    else if (channel.type=="category") {
      embed.setTitle("Category created");
      embed.setDescription("**Name: **"+channel.name);
      channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }
  });

  //Channel or Category Deleted

  client.on('channelDelete', channel => {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Channel removed')
        .setTimestamp();

    if (channel.type=="text") {
      embed.setDescription("**Name: ** #"+channel.name);
      channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    else if (channel.type=="voice") {
      embed.setDescription("**Name: **🔈 "+channel.name);
      channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    else if (channel.type=="category") {
      embed.setTitle("Category removed");
      embed.setDescription("**Name: **"+channel.name);
      channel.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }
  });

  //Channel or Category Updated

  client.on('channelUpdate', (oldCh, newCh) => {
    const embed = new Discord.MessageEmbed()
        .setColor('#ffff00')
        .setTitle('Channel modified')
        .setTimestamp();

    if (oldCh.name.startsWith("Member"))
      return;

    if (oldCh.type=="text") {
      embed.setDescription("**Old Channel: ** #"+oldCh.name+"\n**New Channel: ** #"+newCh.name);
      newCh.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    else if (oldCh.type=="voice") {
      embed.setDescription("**Old Channel: ** 🔈"+oldCh.name+"\n**New Channel: ** 🔈"+newCh.name);
      newCh.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }

    else if (oldCh.type=="category") {
      embed.setTitle("Category modified");
      embed.setDescription("**Old Category: **"+oldCh.name+"\n**New Category: ** 🔈"+newCh.name);
      newCh.guild.channels.cache.find(i => i.name === "action-log").send(embed);
    }
  });
}

module.exports = log;