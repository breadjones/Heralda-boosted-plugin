const HeraldaPlugin = require('heralda-plugin-base');

const defaultConfig = require('./config.json');

class BoostedPlugin extends HeraldaPlugin {
  init(client, config) {
    this.config = HeraldaPlugin.mergeConfigs(config, defaultConfig);

    this._setupDatabase();
    this._setupCommands();
  }

  _setupDatabase() {

  }

  _setupCommands() {

  }
}

module.exports = BoostedPlugin;
