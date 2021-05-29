/* init.js
** CivE Bot
** Author: Jake Sigman
** This file contains the code for initializing the bot.
*/

const Discord = require('discord.js');
const fs = require('fs');

function func(client, status, autoresponses, roles, userID) {

  //Reads init.txt file

  fs.readFile('init.txt', 'utf8', function(err, data) {
    if (err) throw err;
    const lines = data.split("\n");

    //Determines user for logging and determines token, then logs in the bot

    userID += lines[0].split(': ')[1];
    const token = lines[1].split(': ')[1];
    client.login(token);

    //Reads any autorole and autoresponse information needed
    
    let section = "AUTOROLES";
    for (i = 4; i < lines.length; i++) {
      let args = lines[i].split("/");

      //Confirms the section of the file being read

      if (args[0] == "") {
        section = "AUTORESPONSES";
        i += 2;
        args = lines[i].split("/");
      }

      //If reading autoroles, add to roles map

      if (section == "AUTOROLES") {
        roles.set(args[0], args[1]);
      }

      //If reading autoresponses, add to autoresponses map

      else if (section == "AUTORESPONSES") {
        autoresponses.set(args[0], args[1]);
      }
    }
  });

  //Reads status.txt file

  fs.readFile('status.txt', 'utf8', function(err, data) {
    if (err) throw err;
    status += data;
  });
}

module.exports = func;