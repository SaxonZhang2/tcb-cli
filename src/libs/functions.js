const BaseClient = require('../base');
const adminSDK = require('@tencent/tcb-admin-sdk');


class Functions extends BaseClient {
    constructor(config = {}, argv) {
        super(config.env);
        this.config = config;
        this.argv = argv;
        this.adminSDK = adminSDK;
    }

    init() {
        let name = this.argv.name || null;
        let debug = this.argv.debug || false;

        if (name) {
            this.call(name);
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

        this.adminSDK.callFunction({
            name: name,
            data: data
        }).then((result) => {
            console.log(result);
        }).catch((e) => {
            this.error(e.stack);
        });
    }

    debug() {
        console.log('debug functions');
    }
}

module.exports = Functions;