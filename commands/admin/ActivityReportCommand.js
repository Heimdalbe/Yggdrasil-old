const commando = require("discord.js-commando");
const activityManager = require("../../domain/ActivityManager");
const helper = require("../../domain/CommandHelper");
const ActivityUser = require("../../domain/models/ActivityUser");

module.exports = class ActivityReportCommand extends (
  commando.Command
) {
  constructor(client) {
    super(client, {
      name: "act-report",
      memberName: "act-report",
      group: "admin",
      description: "Gives an activity report for a specific user or all users",
    });
  }

  async run(message, args) {
    //Check if command user has Administrator permissions
    let isAdmin = message.channel
      .permissionsFor(message.member)
      .has("ADMINISTRATOR", true);

    if (!isAdmin) {
      helper.replyThenDeleteBoth(
        message,
        "You need Admin Permissions to run this command. Your command and this message will automatically self-destruct in 5 seconds.",
        5000
      );
      return;
    }

    if (args.trim() === "") {
      helper.replyThenDeleteBoth(
        message,
        `Please provide an argument. Use "-all" to get a report for all users, "-tag <usertag>" or "-id <user>" to get a report for a single user.\n
        Your command and this message will automatically self-destruct in 10 seconds.`,
        10000
      );
      return;
    }

    args = args.trim().split(" ");
    this.argsCount = args.length;

    //Activity report for all users

    const type = args.shift().trim().toLowerCase();

    // Check if the first args is a pseudo kwarg
    if (!["-all", "-tag", "-id"].includes(type)) {
      helper.replyThenDeleteBoth(
        message,
        `I don't know that keyword "${type}". Use "-all" to get a report for all users, "-tag <usertag>" or "-id <user>" to get a report for a single user.\n
            Your command and this message will automatically self-destruct in 10 seconds.`,
        10000
      );
      return;
    }

    if (type === "-all") {
      const user = message.author;

      let acts = Object.values(activityManager.getAll());
      let counter = 0;
      let temp = "";
      let messages = [];
      console.log(acts);
      for(let index=0; index < acts.length; index++) {
        console.log(act);
        temp += act.getLastActivityTimeShort();
        if (counter !== 4) {
          temp += "\n";
        }
        // Last line doesnt need newline
        else {
          messages.push(temp);
          temp = "";
        }
        counter++;
        counter = counter % 5;
      }

      user.createDM().then((s) => {
        for (const message in messages) {
          s.send(message);
        }
      });
      return;
    }

    if (!!!args.length) {
      helper.replyThenDeleteBoth(
        message,
        "Please provide an ID of the user (rightclick, Copy ID) if using -id or a user tag if using -tag. Your command and this message will self-destruct in 10 seconds.",
        10000
      );
      return;
    }

    if (args.length !== 1) {
      helper.replyThenDeleteBoth(
        message,
        `I don't need that many arguments. Use "-all" to get a report for all users, "-tag <usertag>" or "-id <user>" to get a report for a single user. Your command and this message will self-destruct in 10 seconds.`,
        10000
      );
      return;
    }

    let arg = args.shift();
    let valid = true;
    let tag = "";

    if (type === "-id") {
      let user;
      await message.channel.guild.members
        .fetch(arg)
        .then((s) => (user = s.user));
      if (!!!user) valid = false;
      else tag = user.tag;
    } else {
      let user = message.channel.guild.members.cache.find((s) => s.tag === arg);
      if (!!!user) valid = false;
      tag = arg;
    }

    if (!valid) {
      helper.replyThenDeleteBoth(
        message,
        `I can't find that user. Please check the ID or tag and try again with a correct value. Your command and this message will self-destruct in 10 seconds.`,
        10000
      );
      return;
    }

    let activity = activityManager.get(tag);
    if (typeof activity !== "string") activity = activity.getLastActivityTime();

    message.author.createDM().then((s) => s.send(activity));
  } //End of method
};
