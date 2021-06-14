const data = require("../data/activity.json");
const fs = require("fs");
const ActivityUser = require("./models/ActivityUser");

class ActivityManager {
  constructor() {
    this.activities = data;
  }

  /**
   * Updates the last activity for a user, or adds it if it's the first
   * @param {ActivityUser} activity Activity, User and type of activity
   */
  update(activity) {
    this.activities[activity.member] = activity;
    this._persist();
  }

  /**
   * Returns the last activity of a user if its present
   * @param {string} tag Tag of the user (Name#xxxx)
   */
  get(tag) {
    if (!!!this.activities[tag]) return `User ${tag} could not be found!`;
    return Object.setPrototypeOf(
      this.activities[tag],
      ActivityUser.User.prototype
    );
  }

  getAll() {
    return this.activities;
  }

  /**
   * Internal use only
   */
  _persist() {
    fs.writeFileSync("./data/activity.json", JSON.stringify(this.activities));
  }
}

const activityManager = new ActivityManager();

module.exports = activityManager;
