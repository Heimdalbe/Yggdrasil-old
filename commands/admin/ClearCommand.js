const commando = require("discord.js-commando");
const helper = require("../../domain/CommandHelper");

module.exports = class ClearCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "clear",
      memberName: "clear",
      group: "admin",
      description: "Clears an amount of messages from a text channel",
      argsCount: 1,
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
      args = "";
      this.argsCount = 0;
    } else {
      args = args.trim().split(" ");
      this.argsCount = args.length;
    }

    //Check arg count
    if (this.argsCount !== 1) {
      helper.replyThenDeleteBoth(
        message,
        "This command " +
          (this.argsCount === 0 ? "" : "only ") +
          "needs to know how many messages should be deleted. The upper limit is 100 (API restrictions). " +
          "\nYour command and this message will automatically self-destruct in 10 seconds.",
        10000
      );
      return;
    }

    args = args[0];

    //Check if command was not sent in DM
    if (message.channel.type !== "text") {
      helper.replyThenDeleteBoth(
        message,
        "This command is meant to clear text channels only! This message and the command will automatically self-destruct in 5 seconds",
        5000
      );
      return;
    }

    //Check if arg is valid and within valid range
    if (isNaN(args) || args < 1 || args > 100) {
      helper.replyThenDeleteBoth(
        message,
        "Please provide a valid number between 0 (exclusive) and 100 (inclusive). This message and the command will automatically self-destruct in 5 seconds",
        5000
      );
      return;
    }

    await message.delete(); //Delete command message before fetching

    message.channel
      .fetchMessages({ limit: args })
      .then((s) => message.channel.bulkDelete(s));
    //TODO Fix
  } //End of method
};
