module.exports = class CommandHelper {
  static replyThenDeleteBoth(message, string, time) {
    message.channel.send(string).then((t) => {
      t.delete(time).then((u) => message.delete());
    });
  }
};
