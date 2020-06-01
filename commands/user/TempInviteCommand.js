const fs = require("fs");
const inviteManager = require("../../domain/InviteManager");
const data = require("../../data/data.json");
const helper = require("../../domain/CommandHelper");
const commando = require("discord.js-commando");

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
        "It seems like you're trying to do this on the server itself. To keep everything clean, please run this command in PM to this bot.\n" +
          "This message and the original command will self-destruct in 10 seconds",
        10000
      );
      return;
    }

    if (message.member.hasPermission("CREATE_INSTANT_INVITE")) {
      helper.replyThenDeleteBoth(
        "Well aren't you a naughty person? It appears you don't have the permission to do that! Contact the admin if you think this isn't correct.\n" +
          "This message and the original command will self-destruct in 10 seconds.",
        10000
      );
      return;
    }

    let code = "";
    channel=message.guild.channels.get(data.defaultChannel);
    channel.createInvite()
  }
};
