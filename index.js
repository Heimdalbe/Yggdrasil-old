const Discord = require("discord.js");
const config = require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const commando = require("discord.js-commando");
const settings = require("./settings.json");
const fs = require("fs");

const client = new commando.CommandoClient({
  owner: "686344322089615387",//TODO change when bot ownership goes to admin account
  commandPrefix: "h!",
  unknownCommandResponse: true,
});
module.exports = client;

client.registry.registerDefaults();
client.registry.registerCommandsIn(path.join(__dirname, "/commands"));

client.on("ready", () => {
  console.log("Derp");
});

client.login(process.env.TOKEN);
