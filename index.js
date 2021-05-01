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

  let guild = client.guilds.cache.first();
  data.guildID = guild.id; //Saves ID of server
  data.defaultChannel = "716801655169089577";

  fs.writeFileSync("./data/data.json", JSON.stringify(data));

  // Load invites for guild and save them to the cache.
  // client.guilds.cache.find((s) => (invites[data.guildID] = s));
  guild.fetchInvites().then((s) => (invites[data.guildID] = s));
});

client.on("error", console.error);

client.on("guildMemberAdd", (member) => {
  // To compare, we need to load the current invite list.
  member.guild.fetchInvites().then((guildInvites) => {
    // This is the *existing* invites for the guild.
    const ei = invites[member.guild.id];

    // Update the cached invites for the guild.
    invites[member.guild.id] = guildInvites;

    console.log(ei);
    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find((i) => ei.get(i.code)?.uses < i.uses);

    console.log(member);

    if (inviteManager.checkIfPresent(invite.code)) {
      inviteManager.activateTimer(invite.code, member);
      console.log("Timer activated");
      invite.delete(); // Deletes invite so can only be used once
    }
  });
});

// Register all off-file event listeners

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
}

client.login(process.env.TOKEN);
