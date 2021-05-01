const activityManager = require("../domain/ActivityManager");
const Activity = require("../domain/models/ActivityUser");

module.exports = {
  name: "message",
  execute(message) {
      console.log("Message posted");
    activityManager.update(
      new Activity.User(message.author.tag, Activity.Type.CHAT)
    );
  },
};
