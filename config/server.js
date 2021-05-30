/* server.js
** CivE Bot
** Author: Jake Sigman
** This file contains a function that keeps the bot alive.
*/

const express = require('express');
const server = express();

server.all('/', (req, res)=>{
    res.send('Your bot is alive!')
});

function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive;