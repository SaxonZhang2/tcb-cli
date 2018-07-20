const BaseClient = require('../base');

class Config extends BaseClient {
    constructor(config = {}, argv) {
        super(config.env);
        this.config = config;
        this.argv = argv;
    }

    /**
     * 命令行入口
     * @param {Array} cmd 命令行操作
     */
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

    /**
     * 列出配置
     * @param {Boolean} isGlobal 是否列出全局配置
     */
    list(isGlobal) {
        this.warn(JSON.stringify(this.readConfig({
            isGlobal: isGlobal,
        }), null, 4));
    }

    /**
     * 添加配置
     * @param {String} key 配置键
     * @param {String} val 配置值
     * @param {Boolean} isGlobal 是否添加全局配置
     */
    add(key, val, isGlobal = false) {
        if (!key || !val) {
            return;
        }

        let config = this.readConfig({
            isGlobal: isGlobal,
            isLocal: !isGlobal
        });

        config[key] = val;
        this.createConfig(config, {
            isGlobal: isGlobal,
            overwrite: true
        });
    }

    /**
     * 删除配置
     * @param {String} key 配置键
     * @param {Boolean} isGlobal 是否删除全局配置
     */
    remove(key, isGlobal = false) {
        if (!key) {
            return;
        }

        let config = this.readConfig({
            isGlobal: isGlobal,
            isLocal: !isGlobal
        });

        if (config.hasOwnProperty(key)) {
            delete config[key];
            this.createConfig(config, {
                isGlobal: isGlobal,
                overwrite: true
            });
        }
    }

    /**
     * 更新配置
     * @param {String} key 配置键
     * @param {String} val 配置值
     * @param {Boolean} isGlobal 是否更新全局配置
     */
    update(key, val, isGlobal = false) {
        let config = this.readConfig({
            isGlobal: isGlobal,
            isLocal: !isGlobal
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