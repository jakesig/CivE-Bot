const keepAlive = require('./server');
const Discord = require('discord.js');
const client = new Discord.Client();

keepAlive();

// Login the bot

client.login('ODMxMDQ3ODUxMDMwMDg1NjQz.YHPjnw.PO7TMjyCkss0saYxEmvtfqQl8Yk');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Vito Cheeto");
});

//Autoresponses

client.on('message', msg => {
  if (msg.content.includes('lennon') && !msg.author.bot)
 	  msg.channel.send('laksfh - i- ksjhfkap- errrrr');
  
  if (msg.content.includes('bastos') && !msg.author.bot)
 	  msg.channel.send('carpe diem :smirk:');

  if (msg.content.includes('stieber') && !msg.author.bot)
 	  msg.channel.send('hoi polloi\nahaw ahaw ahaw');
  
  if (msg.content.includes(':smirk:') && !msg.author.bot)
 	  msg.channel.send('carpe diem :smirk:');
  
  if (msg.content.includes('carpe diem') && !msg.author.bot)
    msg.channel.send(`Hey! That's my line! :smirk:`);

  if (msg.content.includes('akkey') && !msg.author.bot)
 	  msg.channel.send('for crying out loud');
  
  if (msg.content === 'pp' && !msg.author.bot)
 	  msg.channel.send('pp');
  
  if (msg.content.includes('shirley') && !msg.author.bot)
 	  msg.channel.send('various google-ing');
});

//Moderation

client.on('message', msg => {
  if (msg.content.includes("https://thumbs.gfycat.com/TartAdolescentBird-mobile.mp4")) {
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

    if (msg.channel.name==='mod-chat') {
      msg.channel.send(`**CivE Bot List of Commands**\n\n!help: *Opens this menu.*\n!ping: *Pings the bot.*\n!kick {@member}: *Kicks member with name member.*\n!ban {@member}: *Bans member with name member.*\n!purge {number}: *Bulk deletes number of messages specified.*\n!announce {message}: *Posts message in #announcements channel.*\n!echo {message}: *Posts message in #jennaral channel.*\n!aecho {message}: *Posts message in #lennon-section-a channel.*\n!becho {message}: *Posts message in #lennon-section-b channel.*\n!join {channel-name}: *Joins voice call with channel name specified.*`);
      return;
    }

    else {
      msg.channel.send(`**CivE Bot List of Commands**\n\n!help: *Opens this menu.*\n!ping: *Pings the bot.*`);
      return;
    }

  }

  //Perms required past this point.
  
  if (msg.content.startsWith('!') && !msg.member.hasPermission('ADMINISTRATOR')) {
    msg.channel.send("Insufficient perms.");
    return;
  }

  //!becho: Echoes in #lennon-section-b channel.

  if (msg.content.startsWith('!becho') && !msg.author.bot)
 	  msg.guild.channels.cache.find( i => i.name === 'lennon-section-b').send(msg.content.substring(6));

  //!aecho: Echoes in #lennon-section-a channel.

  if (msg.content.startsWith('!aecho') && !msg.author.bot)
 	  msg.guild.channels.cache.find( i => i.name === 'lennon-section-a').send(msg.content.substring(6));

  //!aecho: Echoes in #announcements channel.

  if (msg.content.startsWith('!announce') && !msg.author.bot)
 	  msg.guild.channels.cache.find( i => i.name === 'announcements').send(msg.content.substring(9));

  //!echo: Echoes in #jennaral channel.

  if (msg.content.startsWith('!echo') && !msg.author.bot)
 	  msg.guild.channels.cache.find( i => i.name === 'jennaral').send(msg.content.substring(5));

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
        msg.reply("That user isn't in this guild!");
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
        msg.reply("That user isn't in this guild!");
    } 
    else 
      msg.reply("You didn't mention the user to ban!");
  }

});

//  client.on('guildMemberAdd', member => {
//   member.guild.channels.cache.find(ch => ch.name === 'general').send(`Welcome to the CivE 2024 server, ` + member.username + `! Please wait for a moderator to review your profile.`);
// });