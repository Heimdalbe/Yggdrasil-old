const rxjs = require("rxjs");

module.exports = class InviteTimer {
  constructor(member, time, manager) {
    this.member = member;
    this.time = time;
    this.manager = manager;
    this.endSignal = new rxjs.BehaviorSubject();
    this.timer = null;
    this.activate();
  }

  activate() {
    this.timer = rxjs.timer(time * 1000); //Seconds to milliseconds
    this.timer.subscribe((s) => {
      this.member.kick(
        "Your membership for this server has expired. If you think this is not correct, ask the Admin for a permanent invite."
      );
    });
    return this.endSignal;
  }
};
