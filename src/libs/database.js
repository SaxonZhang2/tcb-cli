const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');


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
        const { collection } = this.argv
        if(!collection || !this.isString(collection)){
            return this.error(`Please input collection.`);
        }
        if (cmd[1] === 'add') {
            return this.add()
        }else if(cmd[1] === 'remove'){
            return this.remove()
        }else if(cmd[1] === 'set'){
            return this.set()
        }else if(cmd[1] === 'update'){
            return this.update()
        }
    }
    /**
     * 添加文档
     */
    async add() {
        const { collection:collectionName = null,  data:file = null} = this.argv

        if(!file || !this.isString(file)){
            throw this.error(`Please input data.`);
        }
        if(!this.fs.existsSync(file)){
            throw this.error(`${file} not exists.`);
        }
        
        const addFileDatas = this.getFileDatas(file)
        const db = this.initAdminSDKDatabase()
        const collection = db.collection(collectionName)

        const addResults = await Promise.all(addFileDatas.map(item => {
            return collection.add(item)
        }))
        this.info(addResults)
        return addResults
    }
    /**
     * 删除文档
     * 1.优先删除指定doc
     * 2.否则从文件中读取doc
     */
    async remove(){
        const { 
            collection:collectionName,
            doc:docId = null,  
            data:file = null
        } = this.argv
        
        let isDocMissing = !docId || !this.isString(docId)
        let isFileMissing = !file || !this.isString(file)
        if(isDocMissing && isFileMissing){
            throw this.error(`Please input doc or data.`);
        }else if(!isFileMissing && !this.fs.existsSync(file)){
            throw this.error(`${file} not exists.`);
        }

        let removeFileDatas = []
        if (docId) {
            removeFileDatas = [{
                doc: docId
            }]
        }else{
            removeFileDatas = this.getFileDatas(file)
        }
       
        const db = this.initAdminSDKDatabase()
        const collection = db.collection(collectionName)

        const removeDocResults = await Promise.all(removeFileDatas.map(item => {
            const doc = collection.doc(item.doc)
            return doc.remove()
        }))
        this.info(removeDocResults);
        return removeDocResults
    }
    /**
     * 更新文档set, update
     * 1.优先更新指定doc
     * 2.否则从文件中读取 doc,set更新
     * 3.set的情况下，collection中不存在任何doc时，会创建新文档
     * @param {Boolean} isUpdate  
     */
    async set(isUpdate){
        const { 
            collection:collectionName,
            doc:docId = null,  
            data:file = null
        } = this.argv
        
        const isDocMissing = !docId || !this.isString(docId)
        const isFileMissing = !file || !this.isString(file)
        if(isFileMissing){
            throw this.error(`Please input data.`);
        }else if(!this.fs.existsSync(file)){
            throw this.error(`${file} not exists.`);
        }

        let setFileDatas = this.getFileDatas(file)
        const db = this.initAdminSDKDatabase()
        const collection = db.collection(collectionName)

        const setDocResults = await Promise.all(setFileDatas.map(item => {
            let setDoc
            let setData
            if(isDocMissing){
                if(item.doc){
                    setDoc = item.doc
                    setData = item.set
                }else{
                    if(isUpdate){
                        throw this.error(`Please input doc.`);
                    }else{
                        setDoc = undefined
                        setData = item
                    }
                }
            }else{
                setDoc = docId
                setData = setData = item
            }
            
            if(!setData){
                throw this.error(`Invalid file content.`);
            }
           
            const doc = collection.doc(setDoc)
            const action = isUpdate ? 'update' : 'set'
            return doc[action](setData)
        }))
        this.info(setDocResults)
        return setDocResults
    }

    update(){
        return this.set(true)
    }

    isArray(obj) {
        return Object.prototype.toString.call(obj).indexOf('Array') != -1
    }

    isString(obj) {
        return Object.prototype.toString.call(obj).indexOf('String') != -1
    }

    initAdminSDKDatabase(){
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
        return this.adminSDK.database()
    }

    getFileDatas(file){
        let fileData
        try{
            fileData = file.endsWith('.json') ? this.fs.readJsonSync(file) : file.endsWith('.js') ? require(file) : {}
        }catch(e){
            throw this.error('Data format is not right.');
        }
        if(!Object.keys(fileData).length){
            throw this.error(`Invalid file content.`);
        }
        return this.isArray(fileData) ? fileData : [fileData]
    }

}

module.exports = Database;