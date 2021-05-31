## CivE Bot

**Author:** Jake Sigman  
**Email:** <jsigman04@gmail.com>  
**Created:** April 14, 2021

### Description

This bot serves to moderate and provide moderators with many useful tools in the server it's a part of. It also includes an autoresponder.

### Initialization

1. Create a file in the same directory of `index.js` called `init.txt`
2. The `init.txt` file should look exactly as follows (ignore any square brackets):

    ```
    USER FOR LOGGING: [ID of user to direct command logs to]
    TOKEN: [Bot token]

    AUTOROLES
    [User ID 1]/[Name of User 1]
    [User ID 2]/[Name of User 2]

    AUTORESPONSES
    [Prompt 1]/[Response 1]
    [Prompt 2]/[Response 2]
    ```
3. Create a file in the same directory of `index.js` called `status.txt`. The `status.txt` file will just contain the desired status of the bot.
4. Ensure that there is a channel named "Member Count" and a channel named "Members Online" for member tracking.
5. Ensure that there is a text channel named "action-log" for the action log.

### Commands

**!help:** Opens the list of commands.  
**!ping:** Pings the bot.  
**!git:** Returns git repository information.  
**!rolelist `{role-name}`:** Lists members with role name specified.  
**!poll `{Question}` `{Option 1}` `{Option 2}` etc. :** Sends out poll with reactions.   

### Moderator Commands

**!kick `{@member}`:** Kicks member with name member.  
**!ban `{@member}`:** Bans member with name member.  
**!purge `{number}`:** Bulk deletes number of messages specified.  
**!echo `{channel-name}` `{message}`:** Sends message in channel specified.  
**!verify `{@member}`:** Assigns Civil Engineering role to member, giving them access to the server.  
**!setstatus `{status}`:** Sets the status of the bot.  
**!autoresponse `{prompt}` `{response}`:** Adds autoresponse to bot with prompt and response respectively.  
**!specverify `{@member}`:** Assigns Spectator role to member.  