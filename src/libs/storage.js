const path = require('path');
const glob = require('glob');
const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');
const ora = require('ora');
const {
    FILE_MISSING,
    FILE_NUM_LIMIT,
    FILE_SIZE_LIMIT,
    FOLDER_EMPTY,
    UPLOAD_SUCCESS
} = require('../common/message');

const SIZE_LIMIT = 50 * 1024 * 1024 * 1024; // 50 GB 是上限
const NUM_LIMIT = 100; // 100 个文件是上限

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
            return this.uploadFolder(folder).catch((e) => {
                this.error(e.message);
            });
        }
        else if (file) {
            file = this.appendPath(file);
            if (!this.fs.existsSync(file)) {
                return Promise.reject(new Error(`${file}: ${FILE_MISSING}`)).catch((e) => {
                    this.error(e.message);
                });
            }

            this.spinStart();

            return this.uploadFile(file).catch((e) => {
                this.error(e.message);
            });
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
        let files = this.getFiles(folder);

        let uploadTask = [];

        if (files.length > NUM_LIMIT) {
            return Promise.reject(new Error(`${FILE_NUM_LIMIT}: 100。`));
        }

        for (let i = 0, len = files.length; i < len; i++) {
            let item = files[i];
            if (this.checkSize(item)) {
                return Promise.reject(new Error(`${FILE_SIZE_LIMIT}: 50GB。`));
            }
            uploadTask.push(this.uploadFile(item));
        }

        if (uploadTask.length) {
            this.spinStart();
        }
        else {
            return Promise.reject(new Error(FOLDER_EMPTY));
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

        if (this.checkSize(file)) {
            return Promise.reject(new Error(`${FILE_SIZE_LIMIT}: 50GB。`));
        }

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
                this.spinFail(`${result.message}: ${file}`);
            }
            else if (data.message === 'SUCCESS') {
                this.spinSucceed(`${path.basename(file)}\nfileId: ${data.fileid}\nfileUrl: ${data.url}: ${UPLOAD_SUCCESS}`);
            }
            else {
                this.spinFail(`${data.message}: ${file}`);
            }
        }).catch((err) => {
            this.spinFail(err.stack);
        });
    }

    /**
     * 获取文件
     * @param {String} folder 文件夹路径
     */
    getFiles(folder) {
        return glob.sync(path.join(folder, '**/*'), {
            nodir: true
        });
    }

    /**
     * 获取文件信息
     * @param {String} file 文件路径
     */
    checkSize(file) {
        let stats = this.fs.statSync(file);
        return stats.size > SIZE_LIMIT;
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