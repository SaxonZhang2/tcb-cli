const path = require('path');
const glob = require('glob');
const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');
const ora = require('ora');

class Store extends BaseClient {
    constructor(config = {}, argv) {
        super(config.env);
        this.config = config;
        this.argv = argv;
        this.adminSDK = adminSDK;
    }

    /**
     * 命令入口
     * @param {Array} cmd
     */
    init(cmd) {
        if (cmd[1] === 'upload') {
            return this.upload();
        }
    }

    /**
     * 上传文件
     */
    upload() {
        let file = this.argv.file || null;
        let folder = this.argv.folder || null;
        let batch = this.argv.batch || false;

        if (batch) {
            return this.uploadBatch();
        }
        else if (folder) {
            folder = this.appendPath(folder);
            return this.uploadFolder(folder);
        }
        else if (file) {
            file = this.appendPath(file);
            if (!this.fs.existsSync(file)) {
                return Promise.reject(new Error(`${file} not exists.`));
            }

            this.spinStart();

            return this.uploadFile(file);
        }
    }

    /**
     * 批量上传
     */
    uploadBatch() {
        return this.uploadFolder(this.config.path.storage);
    }

    /**
     * 上传文件夹
     * @param {String} folder 文件夹
     */
    uploadFolder(folder) {
        let files = glob.sync(path.join(folder, '**/*'), {
            nodir: true
        });
        let uploadTask = [];

        files.forEach((item) => {
            uploadTask.push(this.uploadFile(item));
        });

        if (uploadTask.length) {
            this.spinStart();
        }

        return Promise.all(uploadTask);
    }

    /**
     * 上传文件
     * @param {String} file 文件
     */
    uploadFile(file) {
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

        return this.up(cloudPath, file);
    }

    /**
     * 上传逻辑
     * @param {String} cloudPath 云上的文件路径
     * @param {String} file 本地文件路径
     */
    up(cloudPath, file) {
        return this.adminSDK.uploadFile({
            cloudPath: cloudPath,
            fileContent: this.fs.createReadStream(file)
        }).then((res) => {
            let result = JSON.parse(res);
            let data = result.data;
            if (result.code) {
                this.spinner.fail(`${result.message}`);
            }
            else if (data.message === 'SUCCESS') {
                this.spinSucceed(`${path.basename(file)}\nfileId: ${data.fileid}\nfileUrl: ${data.url}`);
            }
            else {
                this.spinner.fail(`upload ${file} fail`);
            }
        }).catch((err) => {
            this.spinFail(err.stack);
        });
    }

    /**
     * 是否将 cloud/storage 路径放在文件路径前面
     * 如果不是绝对路径，或者相对路径，而是像 file.png 或 folder 这种，则会直接指向 cloud/storage 目录
     * @param {String} filePath 文件/文件夹路径
     */
    appendPath(filePath) {
        let p = filePath;

        if (!p) {
            return '';
        }


        if (path.isAbsolute(p) || p.includes('./')) {
            return p;
        }

        return path.join(this.config.path.storage, p);
    }

    /**
     * spin 开始
     */
    spinStart() {
        this.spinner = ora().start(`Uploading...\n`);
    }

    /**
     * spin 成功结束
     * @param {String} msg 返回信息
     */
    spinSucceed(msg) {
        this.spinner && this.spinner.succeed(msg);
    }

    /**
     * spin 失败结束
     * @param {String} err 错误信息
     */
    spinFail(err) {
        this.spinner && this.spinner.fail(err);
    }
}

module.exports = Store;