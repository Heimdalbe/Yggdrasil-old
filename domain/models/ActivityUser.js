module.exports.User = class ActivityUser {
  constructor(member, type) {
    this.member = member;
    this.timestamp = Date.now();
    this.type = type;
  }

  getLastActivity() {
    let timespan = (
      ((Date.now() - this.timestamp) / 1000) *
      60 *
      60 *
      24
    ).toFixed(1);
    return `User ${member} was last active ${timespan} days ago with ${type}`;
  }
};

const ACTIVITYTYPE = {
  CHAT: "CHAT",
  VOICE: "VOICE",
  REACTION: "REACTION",
};

module.exports.Type = ACTIVITYTYPE;
