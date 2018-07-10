const path = require('path');
const glob = require('glob');
const BaseClient = require('../base');
const adminSDK = require('@tencent/tcb-admin-sdk');
const ora = require('ora');

class Store extends BaseClient {
    constructor(config = {}, argv) {
        super(config.env);
        this.config = config;
        this.argv = argv;
        this.adminSDK = adminSDK;
    }

    init(cmd) {
        this.spinner = ora().start(`Uploading...\n`);

        if (cmd === 'store:upload') {
            this.upload();
        }
    }

    upload() {
        let file = this.argv.file || null;
        let folder = this.argv.folder || null;
        let batch = this.argv.batch || false;

        if (batch) {
            this.uploadBatch();
        }
        else if (folder) {
            this.uploadFolder(folder);
        }
        else if (file) {
            this.uploadFile(file).then((res) => {
                let result = JSON.parse(res);
                let data = result.data;
                if (data.message === 'SUCCESS') {
                    this.spinner.succeed(`${path.basename(file)}\nfileId: ${data.fileid}\nfileUrl: ${data.url}`);
                }
                else {
                    this.spinner.fail(`upload ${file} fail`);
                }
            }).catch((err) => {
                this.spinner.fail(err.stack);
            });
        }
    }

    uploadBatch() {
        this.uploadFolder(this.config.path.storage);
    }

    uploadFolder(folder) {
        let files = glob.sync(path.join(folder, '**/*'), {
            nodir: true
        });
        let uploadTask = [];

        files.forEach((item) => {
            uploadTask.push(this.uploadFile(item, path.dirname(item)));
        });

        Promise.all(uploadTask).then((arr) => {
            let output = '';
            arr.forEach((res, index) => {
                let result = JSON.parse(res);
                let data = result.data;
                if (data.message === 'SUCCESS') {
                    output += `\n${path.basename(files[index])}\nfileId: ${data.fileid}\nfileUrl: ${data.url}\n`;
                }
                else {
                    output += `${path.basename(files[index])} upload failed\n`;
                }
            });
            this.spinner.succeed(output);
        }).catch((err) => {
            this.spinner.fail(err.stack);
        });
    }

    uploadFile(file, folder = '') {
        let cloudPath = file;
        cloudPath = cloudPath.replace(new RegExp(`\\${path.sep}`, 'ig'), '/');

        const {
            env,
            mpappid,
            secretid,
            secretkey,
        } = this.config;

        this.adminSDK.init({
            mpAppId: mpappid,
            envName: env,
            secretId: secretid,
            secretKey: secretkey
        });

        return this.adminSDK.uploadFile({
            cloudPath: cloudPath,
            fileContent: this.fs.createReadStream(file)
        });
    }
}

module.exports = Store;