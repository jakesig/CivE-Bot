const keepAlive = require('./server');
const Discord = require('discord.js');
var fs = require('fs');
const client = new Discord.Client();
let autoresponses = new Map();

fs.readFile('auto.txt', 'utf8', function(err, data) {
    if (err) throw err;
    var responses = data.split("\n");
    for (i = 0; i < responses.length; i++) {
      var args = responses[i].split("/");
      autoresponses.set(args[0],args[1]);
    }
});

keepAlive();

// Login the bot

client.login('');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Yourself");
});

//Autoresponses

client.on('message', msg => {
  if (msg.channel.name=="mod-chat" || msg.channel.name=="mod-review" || msg.channel.name=="announcements")
    return;

  for (let key of autoresponses.keys())
    if (msg.content.includes(key) && !msg.author.bot)
      msg.channel.send(autoresponses.get(key));
  
  if (msg.content === 'pp' && !msg.author.bot)
 	  msg.channel.send('pp');

});

//Moderation

client.on('message', msg => {
  if (msg.content.includes("https://thumbs.gfycat.com/TartAdolescentBird-mobile.mp4") || msg.content.includes("https://gfycat.com/wellgroomedoddhalibut") || msg.content.includes("https://gfycat.com/wetangryflamingo") || msg.content.includes("https://thumbs.gfycat.com/SlipperyBelatedKudu-size_restricted.gif")) {
    msg.channel.bulkDelete(1);
    msg.channel.send("Do not send that GIF in this server!");
  }
});

//Commands

client.on('message', msg => {

  //!ping: Pings the bot.

  if (msg.content === '!ping' && !msg.author.bot) {
 	  msg.reply('pong!');
    return;
  }

  //!help: Prints out helpful information.

  if (msg.content === '!help' && !msg.author.bot) {
    msg.channel.bulkDelete(1);

    if (msg.channel.name==='mod-chat' || msg.channel.name==='mod-log') {
      msg.channel.send(`**CivE Bot List of Commands**\n
      \n!help: *Opens this menu.*
      \n!ping: *Pings the bot.*
      \n!kick {@member}: *Kicks member with name member.*
      \n!ban {@member}: *Bans member with name member.*
      \n!purge {number}: *Bulk deletes number of messages specified.*
      \n!echo {channel-name} {message}: *Echoes message in channel specified.*
      \n!join {channel-name}: *Joins voice call with channel name specified.*
      \n!autoresponse {prompt} {response}: *Adds autoresponse to bot.*`);
      return;
    }

    else {
      msg.channel.send(`**CivE Bot List of Commands**\n
      \n!help: *Opens this menu.*
      \n!ping: *Pings the bot.*`);
      return;
    }

  }
  
  //Perms required past this point.
  
  if (!msg.member.hasPermission('ADMINISTRATOR')) {
    msg.channel.send("Insufficient perms.");
    return;
  }

  //!autoresponse: Adds autoresponse to bot.

  if (msg.content.startsWith('!autoresponse') && !msg.author.bot) {
    msg.channel.bulkDelete(1);
    var args = msg.content.substring(1).split(" ");
    let write = new String("\n"+args[1]+"/"+args[2]);
    fs.appendFile('auto.txt', write, 'utf8', (err) => {
      if (err) throw err;
    });
    msg.channel.send("Autoreponse added!\nPrompt: "+args[1]+"\nResponse: "+args[2]);
 	  autoresponses.set(args[1],args[2]);
    return;
  }

  //!echo: Echoes in provided channel.

  if (msg.content.startsWith('!echo') && !msg.author.bot) {
    var args = msg.content.substring(1).split(" ")
 	  msg.guild.channels.cache.find( i => i.name === args[1]).send(args[2]);
  }

  //!purge: Bulk deletes specified number of messages.

  if (msg.content.startsWith('!purge')) {
    var args = msg.content.substring(1).split(" ");

    let messagecount = parseInt(args[1])+1;

    msg.channel.bulkDelete(messagecount).catch(err => {
      msg.channel.send(`You didn't type it correctly, try again.`);
    });
  }

  //!join: Bot connects to voice channel specified.

  if (msg.content.startsWith('!join') && !msg.author.bot) {
 	  const channel = client.channels.cache.find(i => i.name === msg.content.substring(6));
    if (!channel)
      return console.error("The channel does not exist!");
    channel.join().then(connection => {
      console.log("Successfully connected.");
    }).catch(e => {console.error(e);});
  }

  //!kick: Kicks specified user.

  if (msg.content.startsWith('!kick') && !msg.author.bot) {
    msg.channel.bulkDelete(1);

    const user = msg.mentions.users.first();
    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member
          .kick('null')
          .then(() => {
            msg.channel.send(`i love kicking\nkicked ${user.username}`);
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
  }

  //!ban: Bans specified user.

  if (msg.content.startsWith('!ban') && !msg.author.bot ) {
    msg.channel.bulkDelete(1);

    const user = msg.mentions.users.first();
    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        member.ban({reason: 'Because I said so.',})
        .then(() => {
          msg.channel.send(`banning? even better!\nbanned ${user.username}`);
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
  }

});