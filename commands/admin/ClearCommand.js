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
          t.delete(10000); //Delete reply
          message.delete(10000); //Delete original command
          return;
        });
    }

    args=args.trim().split(" ")
    console.log(!!args);
    console.log(Array.isArray(args));
    console.log(args.length);


    if (args.length!==1) {
      console.log("argcount fucked");
      //Too few or too many
      message
        .reply(
          "This command " +
            (this.argsCount === 0 ? "only " : "") +
            "needs to know how many messages should be deleted. Please provide a number or 'all' to clear all messages. \nYour command and this message will automatically self-destruct in 5 seconds."
        )
        .then((t) => {
          t.delete(10000); //Delete reply
          message.delete(10000); //Delete original command
          return;
        });
    }

    console.log("derp");
    //Check if command was not sent in DM
    if (message.channel) return;
  }
};
