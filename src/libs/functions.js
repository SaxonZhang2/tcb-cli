const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');


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
        // let debug = this.argv.debug || false;

        if (cmd[1] === 'call') {
            if (cmd.length !== 3) {
                return this.error('Please input function name.');
            }
            let name = cmd[2];
            return this.call(name).then((result) => {
                this.log(JSON.stringify(result, null, 4));
            }).catch((e) => {
                this.error(e.stack);
            });
        }
        // else if (debug) {
        //     this.debug();
        // }
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
}

module.exports = Functions;