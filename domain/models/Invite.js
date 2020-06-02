const rxjs = require("rxjs");

module.exports = class Invite {
  /**
   * Creates a new Invite object used to track invites and the time associated with that link.
   * @param {String} code Code of the invite URL
   * @param {number} time Total amount of time a user will stay, in seconds.
   */
  constructor(code, time) {
    this.code = code;
    this.time = time;
  }
};
