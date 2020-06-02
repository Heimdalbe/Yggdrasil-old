const fs = require("fs");
const inviteManager = require("../../domain/InviteManager");
const data = require("../../data/data.json");
const helper = require("../../domain/CommandHelper");
const commando = require("discord.js-commando");
const clipboardy = require("clipboardy");
const Invite = require("../../domain/models/Invite");

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

    let weeks = 0;
    let days = 0; //Default is one day without params
    let hours = 0;
    let minutes = 0;

    if (args.trim() === "") days = 1;
    else {
      //Remove spaces, check if it's still valid
      const reg = new RegExp("([wdhm]d+)+");
      args.replace(" ", "");
      if (!reg.test(args)) {
        helper.replyThenDeleteBoth(
          message,
          "Woa, not sure what those parameters mean. Format them like this: w1 for 1 week, d1 for 1 day, h1 for 1 hour, m1 for 1 minute. \n" +
            "The order of these doesn't matter. Add a space between each of these. If you omit an option, it will be counted as zero. For example, d1 h6 will translate to 0 weeks, 1 day, 6 hours and 0 minutes.\n" +
            "This message and the original command will self-destruct in 20 seconds.",
          20000
        );
        return;
      }
      //Split again
      reg = new RegExp("[wdhm]d+");
      args.split(reg);

      //Process args
      args.forEach((arg) => {
        arg = arg.toString().toLowerCase();
        let data = arg.split("");
        const type = data[0];
        const amount = data[1];

        switch (type) {
          case "w":
            weeks = amount;
            break;
          case "d":
            days = amount;
            break;
          case "h":
            hours = amount;
            break;
          case "m":
            minutes = amount;
            break;
        }
      });
    }

    days += weeks * 7;
    hours += days * 24;
    minutes += hours * 60;
    const totalSeconds = minutes * 60;

    let channel = this.client.guilds
      .get(data.guildID)
      .channels.find((s) => s.id === data.defaultChannel);
    console.log(channel);

    channel.createInvite().then((s) => {
      clipboardy.writeSync(s.url);
      message.channel.send("The link has been copied to your clipboard!");
      inviteManager.addInvite(new Invite(s.code, totalSeconds), guildUser);
    });
  }
};
