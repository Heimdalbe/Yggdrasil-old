const activityManager = require("../domain/ActivityManager");
const Activity = require("../domain/models/ActivityUser");

module.exports = {
  name: "messageReactionAdd",
  execute(messageReaction, user) {
    if (user.bot) return;
    activityManager.update(new Activity.User(user.tag, Activity.Type.REACTION));
  },
};
