module.exports.User = class ActivityUser {
  constructor(member, type) {
    this.member = member;
    this.timestamp = Date.now();
    this.type = type;
  }

  /**
   * Gets the last time this user was active and what type of activity was used, in String format
   */
  getLastActivityTime() {
    let timespan = this._getDaysSinceLastActive();
    return `User ${this.member} was last active ${timespan} ${
      timespan === 1 ? "day" : "days"
    } ago with ${this.type}`;
  }

  getLastActivityTimeShort() {
    let timespan = this._getDaysSinceLastActive();
    return `User ${this.member}, ${timespan} ${
      timespan === 1 ? "day" : "days"
    } using ${this.type}`;
  }

  _getDaysSinceLastActive() {
    return Math.floor(((Date.now() - this.timestamp) / 1000) * 60 * 60 * 24);
  }
};

const ACTIVITYTYPE = {
  CHAT: "CHAT",
  VOICE: "VOICE",
  REACTION: "REACTION",
};

module.exports.Type = ACTIVITYTYPE;
