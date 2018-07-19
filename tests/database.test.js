const fs = require('fs-extra');
const {
    CUR_PATH,
    DATABASE_PATH
} = require('./constants');
let Plugin = require('../src/libs/database');
const path = require('path')
beforeAll(() => {
    process.chdir(DATABASE_PATH);
});

afterAll(() => {
    process.chdir(CUR_PATH);
});
function mockInitAdminSDKDatabase(){
    return jest.fn(() => {
        return {
            collection:function (){
                return {
                    add: function (data){
                        return new Promise(function(resolve, reject) {
                            resolve(data)
                        })         
                    },
                    doc: function (doc){
                        return {
                            remove:function (){
                                return new Promise(function(resolve, reject) {
                                    resolve(doc)
                                })
                            },
                            set: function (data){
                                return new Promise(function(resolve, reject) {
                                    resolve(data)
                                })
                            },
                            update:function (data){
                                return new Promise(function(resolve, reject) {
                                    resolve(data)
                                })
                            }
                        }
                    } 
                }
            }
        }
    })
}

describe('database', () => {
    test('missing collection', () => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd
        });
        expect(plugin.init(cmd)).toBeUndefined()
    })
    test('add single correct json', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/addSingleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add')
        plugin.init(cmd).then(function (results){
            let data = fs.readJsonSync('./cloud/storage/addSingleData.json')
            expect(results).toEqual([data]);
            done()
        });
    })
    test('add multiple correct json', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/addMultipleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add')
        plugin.init(cmd).then(function (results){
            let data = fs.readJsonSync('./cloud/storage/addMultipleData.json')
            expect(results).toEqual(data);
            done()
        });
    })
    test('add single correct js', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/addSingleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add')
        plugin.init(cmd).then(function (results){
            let data = require(path.join(process.cwd(), './cloud/storage/addSingleData.js'))
            expect(results).toEqual([data]);
            done()
        });
    })
    test('add multiple correct js', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/addMultipleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add')
        plugin.init(cmd).then(function (results){
            let data = require(path.join(process.cwd(), './cloud/storage/addMultipleData.js'))
            expect(results).toEqual(data);
            done()
        });
    })
    test('add missing data', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user'
        });
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('add data is true', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: true
        });
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('add data not exists', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './helloworld.xml'
        });
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('add data format error', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/invalidData.js'
        });
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('add data othrt type', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/otherTypeData.map'
        });
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('remove doc', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            doc: 'qwer'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            expect(results).toContain("qwer")
            done()
        });
    })
    test('remove single json', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/removeSingleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            expect(results).toContain("remove-single1")
            done()
        });
    })
    test('remove single js', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/removeSingleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            expect(results).toContain("remove-single1")
            done()
        });
    })
    test('remove multiple json', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/removeMultipleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            expect(results).toContain("remove-multiple1")
            done()
        });
    })
    test('remove multiple js', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/removeMultipleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            expect(results).toContain("remove-multiple1")
            done()
        });
    })
    test('remove missing doc and data', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('remove data not exists', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './notExists.file'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('set doc single json', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            doc: 'single',
            data: './cloud/storage/setSingleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            let data = fs.readJsonSync('./cloud/storage/setSingleData.json')
            expect(results).toEqual([data])
            done()
        });
    })
    test('set doc single js', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            doc: 'single',
            data: path.join(process.cwd(), './cloud/storage/setSingleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            let data = require(path.join(process.cwd(), './cloud/storage/setSingleData.js'))
            expect(results).toEqual([data])
            done()
        }); 
    })
    test('set multiple json', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/setMultipleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            let data = fs.readJsonSync('./cloud/storage/setMultipleData.json')
            expect(results[0]).toEqual(data[0].set)
            done()
        });
    })
    test('set multiple js', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setMultipleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            let data = require(path.join(process.cwd(), './cloud/storage/setMultipleData.js'))
            expect(results[0]).toEqual(data[0].set)
            done()
        });
    })
    test('set missing data', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('set data not exists', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: './notExists.file'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('set data only data', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setOnlyDocData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        });
    })
    test('set data only set', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setOnlySetData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).then(function (results){
            let data = require(path.join(process.cwd(), './cloud/storage/setOnlySetData.js'))
            expect(results).toEqual([data])
            done()
        })
    })
    test('update data only set', (done) => {
        let cmd = ['database', 'update'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setOnlySetData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase()
        plugin.init(cmd).catch(function (error){
            expect(error).toBeUndefined()
            done()
        })
    })
});