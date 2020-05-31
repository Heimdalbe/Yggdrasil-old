const rxjs = require("rxjs");

module.exports = class Invite {
  constructor(code, time) {
    this.code = code;
    this.time = time;
  }
};
