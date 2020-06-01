module.exports = class CommandHelper {
  static replyThenDeleteBoth(message, time) {
    message.reply(message).then((t) => {
      t.delete(time).then((u) => message.delete());
    });
  }
};
