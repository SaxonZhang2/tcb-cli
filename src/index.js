const inquirer = require('inquirer');

const BaseClient = require('./base');
const Init = require('./libs/init');
const Functions = require('./libs/functions');
const Storage = require('./libs/storage');

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
        this.Init = Init;
    }

    /**
     *
     * @param {Object} argv
     */
    init(argv) {
        let cmd = argv._;
        if (!this.config.env && !skipEnvCmd.includes(cmd[0])) {
            return this.askForEnvId(cmd[0], argv);
        }

        this.runCmd(cmd[0], argv);
        return Promise.resolve();
    }

    runCmd(cmd, argv) {
        let instance = null;

        switch (cmd) {
            case 'init': {
                instance = new Init(this.config, argv);
                break;
            }
            case 'functions': {
                instance = new Functions(this.config, argv);
                break;
            }
            case 'storage:upload': {
                instance = new Storage(this.config, argv);
                break;
            }
            case 'storage:getTempFileURL': {
                instance = new Storage(this.config, argv);
                break;
            }
        }

        instance && instance.init(cmd);
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
}

module.exports = Client;