const commando = require("discord.js-commando");

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

  run(message, args) {
    //Check if command user has Administrator permissions
    let isAdmin = message.channel
      .permissionsFor(message.member)
      .has("ADMINISTRATOR", true);

    if (!isAdmin) {
      console.log("Not an admin");
      message
        .reply(
          "You need Admin Permissions to run this command. Your command and this message will automatically self-destruct in 5 seconds."
        )
        .then((t) => {
          t.delete(5000); //Delete reply
          message.delete(5000); //Delete original command
          return;
        });
    }
    if (args.trim() === "") {
      args = "";
      this.argsCount = 0;
    } else {
      args = args.trim().split(" ");
      this.argsCount = args.length;
    }

    //Check arg count
    if (this.argsCount !== 1)
      message
        .reply(
          "This command " +
            (this.argsCount === 0 ? "" : "only ") +
            "needs to know how many messages should be deleted. The upper limit is 100 (API restrictions). " +
            "\nYour command and this message will automatically self-destruct in 10 seconds."
        )
        .then((t) => {
          t.delete(10000); //Delete reply
          message.delete(10000); //Delete original command
          return;
        });

    args = args[0];

    //Check if command was not sent in DM
    if (message.channel.type !== "text")
      message
        .reply(
          "This command is meant to clear text channels only! This message and the command will automatically self-destruct in 5 seconds"
        )
        .then((t) => {
          t.delete(5000); //Delete reply
          message.delete(5000); //Delete original command
          return;
        });

    if (isNaN(args) || args < 1 || args > 100)
      message
        .reply(
          "Please provide a valid number between 0 (exclusive) and 100 (inclusive). This message and the command will automatically self-destruct in 5 seconds"
        )
        .then((t) => {
          t.delete(5000); //Delete reply
          message.delete(5000); //Delete original command
          return;
        });

    message.channel.messages
      .fetchMessages({ limit: args })
      .then((s) => message.channel.bulkDelete(s));//TODO Fix
  } //End of method
};
