const Discord = require("discord.js");
const config = require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const data = require("./data/data.json");
const commando = require("discord.js-commando");
const fs = require("fs");
const wait = require("util").promisify(setTimeout);
const inviteManager = require("./domain/InviteManager");
const rxjs = require("rxjs");

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

const invites = {};

client.on("ready", () => {
  console.log("Ready to go");

  wait(1000);

  let guild = client.guilds.first();
  data.guildID = guild.id; //Saves ID of server
  data.defaultChannel = "716801655169089577";

  fs.writeFileSync("./data/data.json", JSON.stringify(data));

  // Load invites for guild and save them to the cache.
  client.guilds.find((s) => (invites[data.guildID] = s));
});

client.on("guildMemberAdd", (member) => {
  // To compare, we need to load the current invite list.
  member.guild.fetchInvites().then((guildInvites) => {
    // This is the *existing* invites for the guild.
    const ei = invites[member.guild.id];
    // Update the cached invites for the guild.
    invites[member.guild.id] = guildInvites;
    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find((i) => ei.get(i.code).uses < i.uses);

    console.log(invite.code);

    if (inviteManager.checkIfPresent(invite.code)) {
      inviteManager.activateTimer(invite.code);
    }
  });
});

const forbiddenWords = ["@here", "@everyone"]
client.on('message', message => {
  console.log(message.content)
  if (forbiddenWords.includes(message.content.toLowerCase())) {
    message.delete().then(s => {
      message.author.send("It seems like you're trying to use " + message.content)
    })
  }
})

client.login(process.env.TOKEN);
