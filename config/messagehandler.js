const Discord = require('discord.js');
const cmd = require ('../cmd/cmd.js');

function messagehandler(client, autoresponses, userID) {
  
  let perms = false;
  
  client.on("message", msg => {

    //Handles DMs

    if (msg.channel.type == "dm" && !msg.author.bot) {
      console.log(msg.author.username + ": " + msg.content);
      msg.author.send("Hello! I do not accept direct messages. Please contact my owner, Jake.").catch(error => { });
      return;
    }

    //Checks if the bot sent the message

    if (msg.author.bot) {
      return;
    }

    //Boolean that determines if a member has Admin permissions.

    if (msg.member) {
      perms = !(!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot);
    }

    //Moderation

    if (msg.content.includes("https://thumbs.gfycat.com/TartAdolescentBird-mobile.mp4")
      || msg.content.includes("https://gfycat.com/wellgroomedoddhalibut")
      || msg.content.includes("https://gfycat.com/wetangryflamingo")
      || msg.content.includes("https://thumbs.gfycat.com/SlipperyBelatedKudu-size_restricted.gif")) {
      msg.channel.bulkDelete(1);
      msg.channel.send("Do not send that GIF in this server!");
      return;
    }

    //Command Processing

    cmd(client, msg, perms, autoresponses, userID);

    //Autoresponses

    if (msg.channel.name == "mod-chat" 
    || msg.channel.name == "mod-review" 
    || msg.channel.name == "announcements" 
    || msg.author.bot) {
      return;
    }

    for (let key of autoresponses.keys())
    if (msg.content.includes(key) && !msg.content.startsWith("!"))
      msg.channel.send(autoresponses.get(key));
  });
}

module.exports = messagehandler;