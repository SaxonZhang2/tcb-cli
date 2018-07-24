const inquirer = require('inquirer');

const BaseClient = require('./base');
const Init = require('./libs/init');
const Functions = require('./libs/functions');
const Storage = require('./libs/storage');
const Config = require('./libs/config');
const Database = require('./libs/database');
const UpdateNotifier = require('update-notifier');

let {
    Q_MPAPPID,
    Q_ENV,
    Q_SECRETID,
    Q_SECRETKEY,
} = require('./common/questions');
let {
    checkInput
} = require('./common/utils');

const skipEnvCmd = [
    'init',
    'help',
    'config'
];

class Client extends BaseClient {

    constructor(env = null) {
        super(env);
        this.config = this.readConfig();
        this.config.env = env ? env : this.config.env;

        this.setProxy();
    }

    /**
     *
     * @param {Object} argv
     */
    init(argv) {
        let cmd = argv._;
        if (!this.config.env && !skipEnvCmd.includes(cmd[0])) {
            return this.askForEnvId(cmd, argv);
        }

        this.checkUpdate();

        this.runCmd(cmd, argv);

        return Promise.resolve();
    }

    runCmd(cmd, argv) {
        let instance = null;

        switch (cmd[0]) {
            case 'init': {
                instance = new Init(this.config, argv);
                break;
            }
            case 'config': {
                instance = new Config(this.config, argv);
                break;
            }
            case 'database': {
                instance = new Database(this.config, argv);
                break;
            }
            case 'functions': {
                instance = new Functions(this.config, argv);
                break;
            }
            case 'storage': {
                instance = new Storage(this.config, argv);
                break;
            }
        }

        instance && instance.init(cmd);
    }

    checkUpdate() {
        let pkg = require('../package.json');

        let notifier = UpdateNotifier({
            pkg,
            updateCheckInterval: 1000 * 60 * 30, // 30分钟
        });
        notifier.notify({
            isGlobal: true
        });
    }

    /**
     * ask for environment id
     * @param {Object} argv
     */
    askForEnvId(cmd, argv) {
        return inquirer.prompt([
            Q_MPAPPID,
            Q_ENV,
            Q_SECRETID,
            Q_SECRETKEY
        ]).then((answers) => {

            if (checkInput.bind(this)(answers)) {
                return;
            }

            const {
                mpappid,
                env,
                secretid,
                secretkey,
            } = answers;

            this.config = {
                ...this.config,
                mpappid,
                env,
                secretid,
                secretkey
            };

            this.createConfig(this.config);

            this.runCmd(cmd, argv);
        });
    }

    // /**
    //  * 基于模板生成项目
    //  */
    // create(options = {}) {
    //     return new Init(this.config).create(options);
    // }

    // /**
    //  *
    //  */
    // storage() {
    //     return new Storage(this.config);
    // }

    /**
     * 设置请求代理
     */
    setProxy() {
        if (this.config.proxy) {
            process.env.HTTP_PROXY = this.config.proxy;
        }
        if (this.config.https_proxy) {
            process.env.HTTPS_PROXY = this.config.https_proxy;
        }
    }

}

module.exports = Client;