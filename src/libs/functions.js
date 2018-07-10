const BaseClient = require('../base');
const adminSDK = require('@tencent/tcb-admin-sdk');


class Functions extends BaseClient {
    constructor(config = {}, argv) {
        super(config.env);
        this.config = config;
        this.argv = argv;
        this.adminSDK = adminSDK;
    }

    /**
     * 命令处理入口
     */
    init(cmd) {
        let commands = this.argv._;
        let debug = this.argv.debug || false;

        if (cmd === 'functions:call') {
            if (commands.length !== 2) {
                return this.error('Please input function name.');
            }
            let name = commands[1];
            this.call(name).then((result) => {
                console.log(result);
            }).catch((e) => {
                this.error(e.stack);
            });
        }
        else if (debug) {
            this.debug();
        }
    }

    call(name) {
        let data = this.argv.data || '{}';
        const {
            env,
            mpappid,
            secretid,
            secretkey,
        } = this.config;

        try {
            data = JSON.parse(data);
        }
        catch (e) {
            return this.error('Data format is not right.');
        }

        this.adminSDK.init({
            mpAppId: mpappid,
            envName: env,
            secretId: secretid,
            secretKey: secretkey
        });

        return this.adminSDK.callFunction({
            name: name,
            data: data
        });
    }

    debug() {
        console.log('debug functions');
    }
}

module.exports = Functions;