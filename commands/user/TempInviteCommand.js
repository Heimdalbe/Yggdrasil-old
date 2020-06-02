const fs = require("fs");
const inviteManager = require("../../domain/InviteManager");
const data = require("../../data/data.json");
const helper = require("../../domain/CommandHelper");
const commando = require("discord.js-commando");
const clipboardy = require("clipboardy");

module.exports = class TempInviteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "tempinvite",
      memberName: "tempinvite",
      group: "user",
      description:
        "Generates an invite that automatically kicks a user after a given amount of time",
    });
  }

  async run(message, args) {
    if (message.channel.type !== "dm") {
      helper.replyThenDeleteBoth(
        message,
        "It seems like you're trying to do this on the server itself. To keep everything clean, please run this command in PM to this bot.\n" +
          "This message and the original command will self-destruct in 10 seconds",
        10000
      );
      return;
    }

    let guildUser;
    await this.client.guilds
      .get(data.guildID)
      .fetchMember(message.author)
      .then((s) => (guildUser = s));

    if (!guildUser.hasPermission("0x00000001", false, true, true)) {
      helper.replyThenDeleteBoth(
        message,
        "Well aren't you a naughty person? It appears you don't have the permission to do that! Contact the admin if you think this isn't correct.\n" +
          "This message and the original command will self-destruct in 10 seconds.",
        10000
      );
      return;
    }

    let code = "";
    let channel = this.client.guilds
      .get(data.guildID)
      .channels.find((s) => s.id === data.defaultChannel);
    console.log(channel);

    channel.createInvite().then((s) => {
      clipboardy.writeSync(s.url);
      message.channel.send("The link has been copied to your clipboard!");
    });
  }
};
