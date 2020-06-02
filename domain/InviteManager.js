const fs = require("fs");
const data = require("../data/invites.json");
const Invite = require("./models/Invite");
const InviteTimer = require("./models/InviteTimer");

class InviteManager {
  constructor() {
    this.invites = [];
    this.timers = [];
    this._checkForExistingInvites();
  }

  _checkForExistingInvites() {
    data.invites.forEach((s) => this.invites.push(new Invite(s.code, s.time)));
  }

  checkIfPresent(code) {
    return this.invites.some((s) => s.code === code);
  }

  addInvite(invite, member) {
    if (this.checkIfPresent(invite.code)) return;
    this.invites.push(invite);
  }

  activateTimer(code, member) {
    const inv = this.invites.find((s) => s.code === code);
    if (!!!inv) return;

    const timer = new InviteTimer(member, inv.time, this);
    this.timers.push(timer);
    timer.activate().subscribe((s) => this.timers.filter((t) => t !== timer)); //Remove when fired
  }

  removeInvite(code) {
    this.invites.filter((s) => s.code !== code);
    fs.writeFileSync("../data/invites.json", JSON.stringify(this.invites));
  }
}

module.exports = new InviteManager();
