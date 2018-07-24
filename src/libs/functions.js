const path = require('path');
const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');
const { fork } = require('child_process');
const scfBinFile = require.resolve('scf-cli');
const {
    FUNC_NAME_MISSING,
    FILE_MISSING,
    DATA_FORMAT,
} = require('../common/message');

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
                return Promise.reject(new Error(FUNC_NAME_MISSING)).catch((e) => {
                    this.error(e.message);
                });
            }
            let name = cmd[2];
            return this.call(name)
                .then(result => {
                    this.log(JSON.stringify(result, null, 4));
                })
                .catch((e) => {
                    this.error(e.message);
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
                    return Promise.reject(new Error(`${file}: ${FILE_MISSING}`));
                }
            }
        } catch (e) {
            return Promise.reject(new Error(DATA_FORMAT));
        }

        try {
            if (data) {
                data = JSON.parse(data);
                return data;
            }
        } catch (e) {
            return Promise.reject(new Error(DATA_FORMAT));
        }

        return {};
    }

    /**
     * 开启本地 debug 服务器
     */
    debug() {
        fork(scfBinFile, ['init']);
    }
}

module.exports = Functions;
