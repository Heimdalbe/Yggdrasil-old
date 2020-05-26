const commando = require("discord.js-commando");

module.exports = class ClearCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "clear",
      memberName: "clear",
      group: "admin",
      description: "Clears an amount of messages from a text channel",
      args: [
        {
          key: "amount",
          prompt: "How many messages would you like to clear?",
          type: "number, string ('all')",
        },
      ],
    });
  }

  run(message, args){
      console.log("Clear derp");
  }
};
