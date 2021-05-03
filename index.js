const keepAlive = require('./server');
const Discord = require('discord.js');
var fs = require('fs');
const client = new Discord.Client();
let autoresponses = new Map();
let userID = "371052099850469377";

keepAlive();

//Reads the autoresponses in the file auto.txt.

fs.readFile('auto.txt', 'utf8', function(err, data) {
    if (err) throw err;
    var responses = data.split("\n");
    for (i = 0; i < responses.length; i++) {
      var args = responses[i].split("/");
      autoresponses.set(args[0],args[1]);
    }
});

// Login the bot

client.login('ODMxMDQ3ODUxMDMwMDg1NjQz.YHPjnw.Kn9pw0pBbmunwFA2J5oXpHt2Sik');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Yourself");
});

//Welcome message

client.on('guildMemberAdd', member =>{
  const embed = new Discord.MessageEmbed()
	.setColor('#c28080')
	.setTitle('Welcome ' + member.user.username + '!')
	.setDescription('Welcome to the CivE 2024 server ' + member.user.username + '! Please wait for a moderator to review your profile.')
  .setTimestamp();

  member.guild.channels.cache.find(i => i.name === "welcome").send(embed);

});

//Message handler

client.on('message', msg => {

  //Handles DMs

  if (msg.channel.type == "dm" && !msg.author.bot) {
    console.log(msg.author.username+": " + msg.content);
    msg.author.send("Hello! I do not accept direct messages. Please contact my owner, Jake.").catch(error => {});
    return;
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

  //Commands

  //!ping: Pings the bot.

  if (msg.content === '!ping' && !msg.author.bot) {
    client.users.cache.get(userID).send("Bot was pinged!");
 	  msg.reply('pong!');
    return;
  }

  //!help: Prints out helpful information.

  if (msg.content === '!help' && !msg.author.bot) {
    msg.channel.bulkDelete(1);

    msg.channel.startTyping();

    const mod_embed = new Discord.MessageEmbed()
	  .setColor('#c28080')
	  .setTitle('CivE Bot List of Commands')
	  .setDescription(`!help: *Opens this menu.*
      !ping: *Pings the bot.*
      !kick {@member}: *Kicks member with name member.*
      !ban {@member}: *Bans member with name member.*
      !purge {number}: *Bulk deletes number of messages specified.*
      !echo {channel-name} {message}: *Echoes message in channel specified.*
      !join {channel-name}: *Joins voice call with channel name specified.*
      !autoresponse {prompt} {response}: *Adds autoresponse to bot.*`)
    .setTimestamp();

    const embed = new Discord.MessageEmbed()
	  .setColor('#c28080')
	  .setTitle('CivE Bot List of Commands')
	  .setDescription(`!help: *Opens this menu.*
      !ping: *Pings the bot.*`)
    .setTimestamp();

    msg.channel.stopTyping();

    if (msg.channel.name==='mod-chat' || msg.channel.name==='mod-log') {
      msg.channel.send(mod_embed);
      return;
    }

    else {
      msg.channel.send(embed);
      return;
    }

  }  

  //!autoresponse: Adds autoresponse to bot.

  if (msg.content.startsWith('!autoresponse') && !msg.author.bot) {

    if (!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot) {
      return;
    }

    msg.channel.bulkDelete(1);

    var args = msg.content.substring(1).split(" ");
    const embed = new Discord.MessageEmbed()
	  .setColor('#c28080')
	  .setTitle('Autoresponse added!')
	  .setDescription('**Prompt: **'+args[1]+"\n**Response: **"+args[2])
    .setTimestamp();
    let write = new String("\n"+args[1]+"/"+args[2]);

    if (args.length>3) {
      for (i = 3; i < args.length; i++) {
          write+=" "+args[i];
      }
      var key = write.split("/");
      embed.setDescription('**Prompt: **'+args[1]+"\n**Response: **"+key[1]);
      msg.channel.send(embed);
      client.users.cache.get(userID).send(embed);
      fs.appendFile('auto.txt', write, 'utf8', (err) => {
      if (err) throw err;
      });
      autoresponses.set(args[1],key[1]);
      return;
    }

    fs.appendFile('auto.txt', write, 'utf8', (err) => {
      if (err) throw err;
    });    

    msg.channel.send(embed);
    client.users.cache.get(userID).send(embed);
 	  autoresponses.set(args[1],args[2]);
    return;
  }

  //!echo: Echoes in provided channel.

  if (msg.content.startsWith('!echo') && !msg.author.bot) {

    client.users.cache.get(userID).send("**Command Ran: **"+msg.content);

    if (!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot) {
      return;
    }

    var args = msg.content.substring(1).split(" ");
    let write = new String(args[2]);
    var i;
    if (args.length>3) {
      for (i = 3; i < args.length; i++) {
          write+=" "+args[i];
      }
      msg.guild.channels.cache.find( i => i.name === args[1]).send(write);
      return;
    }
 	  msg.guild.channels.cache.find( i => i.name === args[1]).send(args[2]);
    return;
  }

  //!purge: Bulk deletes specified number of messages.

  if (msg.content.startsWith('!purge')) {

    if (!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot) {
      return;
    }

    client.users.cache.get(userID).send("**Command Ran: **"+msg.content);

    var args = msg.content.substring(1).split(" ");

    let messagecount = parseInt(args[1])+1;

    msg.channel.bulkDelete(messagecount).catch(err => {
      msg.channel.send(`You didn't type it correctly, try again.`);
    });
    return;
  }

  //!join: Bot connects to voice channel specified.

  if (msg.content.startsWith('!join') && !msg.author.bot) {

    if (!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot) {
      return;
    }

 	  const channel = client.channels.cache.find(i => i.name === msg.content.substring(6));
    if (!channel)
      return console.error("The channel does not exist!");
    channel.join().then(connection => {
      console.log("Successfully connected.");
    }).catch(e => {console.error(e);});
    return;
  }

  //!kick: Kicks specified user.

  if (msg.content.startsWith('!kick') && !msg.author.bot) {

    if (!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot) {
      return;
    }

    client.users.cache.get(userID).send("**Command Ran: **"+msg.content);

    msg.channel.bulkDelete(1);
    const user = msg.mentions.users.first();

    const embed = new Discord.MessageEmbed()
	  .setColor('#c28080')
	  .setTitle('Kicked '+user.username)
	  .setDescription('I love kicking.')
    .setTimestamp();

    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member
          .kick('null')
          .then(() => {
            msg.channel.send(embed);
          })
          .catch(err => {
            msg.reply('I was unable to kick the member');
            console.error(err);
          });
      } 
      else 
        msg.reply("That user isn't in this server!");
    } 
    else
      msg.reply("You didn't mention the user to kick!");
    return;
  }

  //!ban: Bans specified user.

  if (msg.content.startsWith('!ban') && !msg.author.bot ) {

    if (!msg.member.hasPermission('ADMINISTRATOR') && !msg.author.bot) {
      return;
    }

    client.users.cache.get(userID).send("**Command Ran: **"+msg.content);

    msg.channel.bulkDelete(1);
    const user = msg.mentions.users.first();

    const embed = new Discord.MessageEmbed()
	  .setColor('#c28080')
	  .setTitle('Banned '+user.username)
	  .setDescription('Banning? Even better!')
    .setTimestamp();

    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member.ban({reason: 'Because I said so.',})
        .then(() => {
          msg.channel.send(embed);
        })
        .catch(err => {
          msg.reply('I was unable to ban the member');
          console.error(err);
        });
      } 
      else 
        msg.reply("That user isn't in this server!");
    } 
    else 
      msg.reply("You didn't mention the user to ban!");
    return;
  }

  //Autoresponses

  if (msg.channel.name=="mod-chat" 
  || msg.channel.name=="mod-review" 
  || msg.channel.name=="announcements")
    return;

  for (let key of autoresponses.keys())
    if (msg.content.includes(key) && !msg.author.bot)
      msg.channel.send(autoresponses.get(key));
  
  if (msg.content === 'pp' && !msg.author.bot)
 	  msg.channel.send('pp');

});