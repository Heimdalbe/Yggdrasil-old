const activityManager = require("../domain/ActivityManager");
const Activity = require("../domain/models/ActivityUser");

module.exports = {
  name: "message",
  execute(message) {
    if (message.author.bot) return;
    activityManager.update(
      new Activity.User(message.author.tag, Activity.Type.CHAT)
    );
  },
};
