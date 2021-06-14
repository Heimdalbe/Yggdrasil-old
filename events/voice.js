const activityManager = require("../domain/ActivityManager");
const Activity = require("../domain/models/ActivityUser");

module.exports = {
  name: "voiceStateUpdate",
  execute(oldState, newState) {
    // !!!newState means a disconnect, equal states channelID means no channel changes
    // No channelID means join, else it's changing channel
    if (
      !!!newState.channelID ||
      oldState?.channelID === newState?.channelID ||
      newState.member.user.bot
    )
      return;
    activityManager.update(
      new Activity.User(newState.member.user.tag, Activity.Type.VOICE)
    );
  },
};
