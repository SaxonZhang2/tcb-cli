const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');
const path = require('path');
const {
    COLLECTION_MISSING,
    INPUT_DATA_MISSING,
    FILE_MISSING,
    DATA_FORMAT,
    DATA_OR_DOC_MISSING,
    DOC_MISSING
} = require('../common/message');

class Database extends BaseClient {
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
        const { collection } = this.argv;
        if (!collection || !this._.isString(collection)) {
            return this.error(COLLECTION_MISSING);
        }
        if (cmd[1] === 'add') {
            return this.add();
        } else if (cmd[1] === 'remove') {
            return this.remove();
        } else if (cmd[1] === 'set') {
            return this.set();
        } else if (cmd[1] === 'update') {
            return this.update();
        }
    }
    /**
     * 添加文档
     */
    add() {
        let {
            collection: collectionName = null,
            data: file = null
        } = this.argv;
        const self = this;
        if (!file || !this._.isString(file)) {
            return this.error(INPUT_DATA_MISSING);
        }
        file = this.appendPath(file);
        if (!this.fs.existsSync(file)) {
            return this.error(`${file}: ${FILE_MISSING}`);
        }

        const addFileDatas = this.getFileDatas(file);

        if (!addFileDatas) {
            return;
        }

        const db = this.initAdminSDKDatabase();
        const collection = db.collection(collectionName);

        return Promise.all(addFileDatas.map(item => {
            return collection.add(item);
        })).then(function (results) {
            self.info(results);
            return results;
        });
    }
    /**
     * 删除文档
     */
    remove() {
        let {
            collection: collectionName,
            doc: docId = null,
            data: file = null
        } = this.argv;
        const self = this;
        let isDocMissing = !docId || !this._.isString(docId);
        let isFileMissing = !file || !this._.isString(file);
        file = this.appendPath(file);
        if (isDocMissing && isFileMissing) {
            return this.error(DATA_OR_DOC_MISSING);
        } else if (!isFileMissing && !this.fs.existsSync(file)) {
            return this.error(`${file} ${FILE_MISSING}`);
        }

        let removeFileDatas;
        if (docId) {
            removeFileDatas = [{
                doc: docId
            }];
        } else {
            removeFileDatas = this.getFileDatas(file);
        }
        if (!removeFileDatas) {
            return;
        }
        const db = this.initAdminSDKDatabase();
        const collection = db.collection(collectionName);

        return Promise.all(removeFileDatas.map(item => {
            const doc = collection.doc(item.doc);
            return doc.remove();
        })).then(function (results) {
            self.info(results);
            return results;
        });
    }
    /**
     * 更新文档 set
     * @param {Boolean} isUpdate 是否走 update 逻辑，update 需指定 doc
     */
    set(isUpdate) {
        let {
            collection: collectionName,
            doc: docId = null,
            data: file = null
        } = this.argv;
        const self = this;
        const isDocMissing = !docId || !this._.isString(docId);
        const isFileMissing = !file || !this._.isString(file);
        file = this.appendPath(file);
        if (isFileMissing) {
            return this.error(INPUT_DATA_MISSING);
        } else if (!this.fs.existsSync(file)) {
            return this.error(`${file}: ${FILE_MISSING}`);
        }

        let setFileDatas = this.getFileDatas(file);
        if (!setFileDatas) {
            return;
        }

        const db = this.initAdminSDKDatabase();
        const collection = db.collection(collectionName);

        return Promise.all(setFileDatas.map(item => {
            let setDoc;
            let setData;
            if (isDocMissing) {
                if (item.doc) {
                    setDoc = item.doc;
                    setData = item.set;
                } else {
                    if (isUpdate) {
                        return Promise.reject(this.error(DOC_MISSING));
                    } else {
                        setData = item;
                    }
                }
            } else {
                setDoc = docId;
                setData = setData = item;
            }

            if (!setData) {
                return Promise.reject(this.error(DATA_FORMAT));
            }

            const doc = collection.doc(setDoc);
            const action = isUpdate ? 'update' : 'set';
            return doc[action](setData);
        })).then(function (results) {
            self.info(results);
            return results;
        });
    }
    /**
     * 更新文档 update
     */
    update() {
        return this.set(true);
    }
    /**
     * 初始化AdminSDK，返回数据库的引用
     */
    initAdminSDKDatabase() {
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
        return this.adminSDK.database();
    }
    /**
     * 是否将 cloud/database 路径放在文件路径前面
     * 如果不是绝对路径，或者相对路径，而是像 file.png 或 folder 这种，则会直接指向 cloud/database 目录
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

        return path.join(this.config.path.database, p);
    }
    /**
     * 读取上传文件
     * @param {String} file 待读取的文件
     */
    getFileDatas(file) {
        let fileData;
        try {
            fileData = file.endsWith('.json') ? this.fs.readJsonSync(file) : file.endsWith('.js') ? require(file) : {};
        } catch (e) {
            return this.error(DATA_FORMAT);
        }
        if (!Object.keys(fileData).length) {
            return this.error(DATA_FORMAT);
        }
        return this._.isArray(fileData) ? fileData : [fileData];
    }

}

module.exports = Database;