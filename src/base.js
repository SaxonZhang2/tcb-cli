const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const _ = require('lodash');

const CONFIG_NAME = 'tcb.json';

class BaseClient {

    constructor(env) {
        this.env = env;
        this.fs = fs;
        this.chalk = chalk;
        this._ = _;
    }

    /**
     * get global home dir
     * @returns {String}
        */
    getGlobalHome() {
        return os.homedir();
    }

    /**
     * get global config path
     */
    getGlobalConfigPath() {
        return path.resolve(path.join(this.getGlobalHome(), CONFIG_NAME));
    }

    /**
     * read config file, local config extends global config
     * @param  {Object} config [config object]
     * @param  {Object} option [options]
     */
    readConfig(option = {}) {
        let folder = option.folder || process.cwd();
        let filename = CONFIG_NAME;

        let isGlobal = option.isGlobal || false;

        let globalConfigFile = this.getGlobalConfigPath();
        let globalConfig = this._readFile(globalConfigFile);

        if (isGlobal) {
            return globalConfig;
        }

        let localConfigFile = path.resolve(path.join(folder, filename));
        let localConfig = this._readFile(localConfigFile);

        return this._.merge({}, globalConfig, localConfig);
    }

    /**
     * Create config file
     * @param  {Object} config [config object]
     * @param  {Object} option [options]
    */
    createConfig(config = {}, option = {}) {
        let folder = (option.isGlobal) ? this.getGlobalHome() : (option.folder || process.cwd());
        let filename = CONFIG_NAME;
        let overwrite = option.overwrite || false; // overwrite the config file or not

        let configFile = path.resolve(path.join(folder, filename));

        if (!overwrite && this.fs.existsSync(configFile)) {
            throw new Error(configFile + ' exists');
        }

        this._writeFile(configFile, config);
    }

    /**
     * read config file
     * @param  {String} filepath  [file path]
     * @return {Object}           [config object]
    */
    _readFile(pathParam) {
        let config = {};

        try {
            // 获取真实路径
            let filepath = fs.realpathSync(pathParam);
            if (require.cache[filepath]) {
                delete require.cache[filepath];
            }

            config = require(filepath) || {};
        }
        catch (e) {
            return config;
        }

        return config;
    }

    /**
     * write config file
     * @param  {String} filepath [config file path]
     * @param  {Object|String}          [config content]
    */
    _writeFile(filepath, config) {
        let content = JSON.stringify(config, null, 4);
        try {
            this.fs.ensureFileSync(filepath);
            this.fs.writeFileSync(filepath, content, 'utf-8');
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * log things
     * @param str
     * @param color
     * @returns {String}
     */
    log(s, color = 'white') {
        let str = s || '';
        str = _.isObject(str) ? JSON.stringify(str) : str;
        let msg = chalk[color](str);

        console.info(msg);
        return msg;
    }

    /**
     * print errors
     * @param str
     */
    error(str) {
        this.log(str, 'red');
    }

    /**
     * print infos
     * @param str
     */
    info(str) {
        this.log(str, 'cyan');
    }

    /**
     * print warnings
     * @param str
     */
    warn(str) {
        this.log(str, 'yellow');
    }

    /**
     * pring success info
     * @param str
     */
    success(str) {
        this.log(str, 'green');
    }
}

module.exports = BaseClient;