const Discord = require("discord.js");
const config = require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const commando = require("discord.js-commando");
const fs = require("fs");

const client = new commando.CommandoClient({
  owner: "686344322089615387", //TODO change when bot ownership goes to admin account
  commandPrefix: ";",
  unknownCommandResponse: true,
});

module.exports = client;

client.registry
  .registerDefaults() //Registers default stuff
  .registerGroups([
    //Registers the command groups
    ["admin", "Administrator commands"],
    ["user", "User commands"],
  ])
  .registerCommandsIn(path.join(__dirname, "commands")); //Registers where the command files can be find, separated by group in a folder with that groups name

client.on("ready", () => {
  console.log("Ready to go");
});

client.login(process.env.TOKEN);
