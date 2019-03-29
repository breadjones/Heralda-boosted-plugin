const HeraldaPlugin = require('heralda-plugin-base');
const Booster = require('./classes/booster.js');

const defaultConfig = require('./config.json');

class BoostedPlugin extends HeraldaPlugin {
  init(client, config) {
    this.config = HeraldaPlugin.mergeConfigs(config, defaultConfig);
    this.booster = new Booster();
    this._setupCommands();
  }

  _setupCommands() {
    this.responder.addListener({
      messages: this.config.commands.list,
      privateAllowed: true,
      callback: this._list.bind(this)
    });
  }

  _list(message) {
    this.booster.list(boosterMessage => {
        message.channel.sendMessage(boosterMessage);
    }, message.guild);
  }
}

module.exports = BoostedPlugin;
