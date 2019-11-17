const HeraldaPlugin = require('heralda-plugin-base');
const Booster = require('./classes/booster.js');

const defaultConfig = require('./config.json');

class BoostedPlugin extends HeraldaPlugin {
  init(client, config) {
    this.config = HeraldaPlugin.mergeConfigs(config, defaultConfig);
    this.booster = new Booster(this.config);
    this.recentlyBoostedUsers = [];
    this._setupCommands();
  }

  _setupCommands() {
    this.responder.addListener({
      messages: this.config.commands.list,
      privateAllowed: true,
      callback: this._list.bind(this)
    });

    this.responder.addListener({
      messages: this.config.commands.tier1,
      privateAllowed: false,
      callback: this._lightBoost.bind(this)
    });

    this.responder.addListener({
      messages: this.config.commands.tier2,
      privateAllowed: false,
      callback: this._mediumBoost.bind(this)
    });

    this.responder.addListener({
      messages: this.config.commands.tier3,
      privateAllowed: false,
      callback: this._heavyBoost.bind(this)
    });
  }

  _list(message) {
    this.booster.list(boosterMessage => {
        message.channel.sendMessage(boosterMessage);
    }, message.guild);
  }

  _lightBoost(message) {
    const boostAmount = Math.floor(Math.random() * 3) + 1
    this._boost(message, boostAmount)
  }

  _mediumBoost(message) {
    const boostAmount = Math.floor(Math.random() * 5) + 4;
    this._boost(message, boostAmount)
  }

  _heavyBoost(message) {
    const boostAmount = Math.floor(Math.random() * 8) + 10;
    this._boost(message, boostAmount)
  }

  _findTheBoostees(message) {
    if (message.mentions.length === 0) {
      message.channel.sendMessage("You forgot to @mention someone, so it sounds like you're the boosted one.");
      return [message.author];
    }

    return message.mentions;
  }

  _boost(message, boostBy = 1) {
    let boostees = this._findTheBoostees(message)

    boostees.forEach(boostee => {
      if (this.recentlyBoostedUsers.indexOf(boostee.id) !== -1) {
        message.channel.sendMessage(boostee.username + this.config.wasJustBoostedMessage);
        return;
      }

      this.recentlyBoostedUsers.push(boostee.id);
      booster.boost(boostee, newBoostedScore => {
        message.channel.sendMessage("<@!" + boostee.id + "> is now " + newBoostedScore + "% maximum boosted.");
      }, boostBy);

      setTimeout(() => {
        const boosteeIndex = this.recentlyBoostedUsers.indexOf(boostee.id);
          this.recentlyBoostedUsers.splice(boosteeIndex, 1);
      }, 76000);
    })
  }
}

module.exports = BoostedPlugin;
