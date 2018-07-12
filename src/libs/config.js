const path = require('path');
const BaseClient = require('../base');

class Config extends BaseClient {
    constructor(config = {}, argv) {
        super(config.env);
        this.config = config;
        this.argv = argv;
    }

    init(cmd) {
        let isGlobal = this.argv.global || this.argv.g || false;
        let key = null;
        let val = null;

        if (cmd.length === 3) {
            let kv = cmd[2].split('=');

            if (kv.length === 2) {
                key = kv[0];
                val = kv[1];
            }
            else if (kv.length === 1) {
                key = kv[0];
            }
        }

        if (cmd[1] === 'add') {
            this.add(key, val, isGlobal);
        }
        else if (cmd[1] === 'remove') {
            this.remove(key, isGlobal);
        }
        else if (cmd[1] === 'update') {
            this.update(key, val, isGlobal);
        }
        else if (cmd[1] === 'list') {
            this.list(isGlobal);
        }
    }

    list(isGlobal) {
        this.warn(JSON.stringify(this.readConfig({
            isGlobal: isGlobal,
        }), null, 4));
    }

    add(key, val, isGlobal) {
        if (!key || !val) {
            return;
        }

        let config = this.readConfig({
            isGlobal: isGlobal
        });

        config[key] = val;
        this.createConfig(config, {
            isGlobal: isGlobal,
            overwrite: true
        });
    }

    remove(key, isGlobal) {
        if (!key) {
            return;
        }

        let config = this.readConfig({
            isGlobal: isGlobal
        });

        if (config.hasOwnProperty(key)) {
            delete config[key];
            this.createConfig(config, {
                isGlobal: isGlobal,
                overwrite: true
            });
        }
    }

    update(key, val, isGlobal) {
        let config = this.readConfig({
            isGlobal: isGlobal
        });

        if (!key || !val || !config.hasOwnProperty(key)) {
            return;
        }

        config[key] = val;
        this.createConfig(config, {
            isGlobal: isGlobal,
            overwrite: true
        });
    }
}

module.exports = Config;