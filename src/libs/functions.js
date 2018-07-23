const path = require('path');
const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');
const { fork } = require('child_process');
const scfBinFile = require.resolve('scf-cli');

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
        if (cmd[1] === 'call') {
            if (cmd.length < 3) {
                return this.error('Please input function name.');
            }
            let name = cmd[2];
            return this.call(name)
                .then(result => {
                    this.log(JSON.stringify(result, null, 4));
                })
                .catch(e => {
                    this.error(e.stack);
                });
        } else if (cmd[1] === 'debug') {
            this.debug();
        }
    }

    call(name) {
        let data = this.getData();
        //  如果返回 promise，表示有报错
        if (data.then) {
            return data;
        }

        const { env, mpappid, secretid, secretkey } = this.config;

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

    /**
     * 获取参数
     */
    getData() {
        let data = this.argv.data;
        let file = this.argv.file;

        try {
            if (file) {
                file = path.resolve(file);

                if (this.fs.existsSync(file)) {
                    data = require(file);
                    return data;
                } else {
                    return Promise.reject(new Error(`${file} not exists.`));
                }
            }
        } catch (e) {
            return Promise.reject(new Error('Data format is not right.'));
        }

        try {
            if (data) {
                data = JSON.parse(data);
                return data;
            }
        } catch (e) {
            return Promise.reject(new Error('Data format is not right.'));
        }

        return {};
    }

    debug() {
        console.log('debug');
        console.log(this.argv);
        fork(scfBinFile, ['init']);
    }
}

module.exports = Functions;
