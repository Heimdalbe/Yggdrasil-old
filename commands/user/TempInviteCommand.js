const fs = require("fs");
const clipboardy = require("clipboardy");
const commando = require("discord.js-commando");

const inviteManager = require("../../domain/InviteManager");
const data = require("../../data/data.json");
const helper = require("../../domain/CommandHelper");
const Invite = require("../../domain/models/Invite");

module.exports = class TempInviteCommand extends (
  commando.Command
) {
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
    if (message.channel.type !== "text") {
      helper.replyThenDeleteBoth(
        message,
        "It seems like you're trying to do this via DM. To keep everything clean, please run this command in a text channel of the server you're trying to invite someone to.\n" +
          "This message and the original command will self-destruct in 10 seconds",
        10000
      );
      return;
    }

    let guildUser;
    guildUser = this.client.guilds.cache
      .get(data.guildID)
      .member(message.author);

    if (!guildUser.hasPermission("CREATE_INSTANT_INVITE", false, true, true)) {
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

    const reg = new RegExp("(([1-9]\\d*)[wdhm])(\\s+([1-9]\\d*)[wdhm])*");

    if (args.trim() === "") days = 1;
    else {
      //Remove spaces, check if it's still valid
      if (!reg.test(args)) {
        helper.replyThenDeleteBoth(
          message,
          "Woa, not sure what those parameters mean. Format them like this: 1w for 1 week, 1d for 1 day, 1h for 1 hour, 1m for 1 minute. \n" +
            "The order of these doesn't matter. Add a space between each of these. If you omit an option, it will be counted as zero. For example, 1d 6h will translate to 0 weeks, 1 day, 6 hours and 0 minutes.\n" +
            "This message and the original command will self-destruct in 20 seconds.",
          20000
        );
        return;
      }
      //Split again
      args = args.split(" ");

      //Process args
      args.forEach((arg) => {
        arg = arg.toString().toLowerCase();
        let data = arg.split("");

        const amount = data[0];
        console.log(amount);
        const type = data[1];

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

    days = +days + +weeks * +7;
    hours = +hours + +days * +24;
    minutes = +minutes + +hours * +60;
    const totalSeconds = +minutes * +60;

    console.log(weeks + ", " + days + ", " + hours + ", " + minutes);
    console.log("Totalseconds: " + totalSeconds);

    let channel = this.client.guilds.cache
      .get(data.guildID)
      .channels.cache.find((s) => s.id === data.defaultChannel);

    channel.createInvite().then((s) => {
      clipboardy.writeSync(s.url);
      message.channel.send("The link has been copied to your clipboard!");
      inviteManager.addInvite(new Invite(s.code, totalSeconds), guildUser);
    });
  }
};
