const {
    CUR_PATH,
    DATABASE_PATH,
    PATH_CONFIG
} = require('./constants');
let Plugin = require('../src/libs/database');
const path = require('path');
beforeAll(() => {
    process.chdir(DATABASE_PATH);
});

afterAll(() => {
    process.chdir(CUR_PATH);
});
function mockInitAdminSDKDatabase() {
    return jest.fn(() => {
        return {
            collection: function () {
                return {
                    add: function (data) {
                        return new Promise(function(resolve, reject) {
                            resolve({ id: 'W1CMR-KgOjo4mlNL', requestId: 'f488840285385' });
                        });
                    },
                    doc: function (doc) {
                        return {
                            remove: function () {
                                return new Promise(function(resolve, reject) {
                                    resolve({ deleted: 1, requestId: 'a09147e5229e2' });
                                });
                            },
                            set: function (data) {
                                return new Promise(function(resolve, reject) {
                                    resolve({ updated: 1, upsertedId: null, requestId: '40bf5ecaf8fd5' });
                                });
                            },
                            update: function (data) {
                                return new Promise(function(resolve, reject) {
                                    resolve({ updated: 1, upsertedId: null, requestId: '6ba3209ec705e' });
                                });
                            }
                        };
                    }
                };
            }
        };
    });
}

describe('database', () => {
    test('missing collection', () => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd
        });
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('add single correct json', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/addSingleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add');
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('id');
            done();
        });
    });
    test('add multiple correct json', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/addMultipleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add');
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('id');
            done();
        });
    });
    test('add single correct js', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/addSingleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add');
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('id');
            done();
        });
    });
    test('add multiple correct js', (done) => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/addMultipleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase('add');
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('id');
            done();
        });
    });
    test('add missing data', () => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user'
        });
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('add data is true', () => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: true
        });
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('add data not exists', () => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './helloworld.xml'
        });
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('add data format error', () => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/invalidData.js'
        });
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('add data othrt type', () => {
        let cmd = ['database', 'add'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/otherTypeData.map'
        });
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('remove doc', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            doc: 'qwer'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('deleted');
            done();
        });
    });
    test('remove single json', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/removeSingleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('deleted');
            done();
        });
    });
    test('remove single js', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/removeSingleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('deleted');
            done();
        });
    });
    test('remove multiple json', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/removeMultipleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('deleted');
            done();
        });
    });
    test('remove multiple js', (done) => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/removeMultipleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('deleted');
            done();
        });
    });
    test('remove missing doc and data', () => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('remove data not exists', () => {
        let cmd = ['database', 'remove'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './notExists.file'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('set doc single json', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            doc: 'single',
            data: './cloud/storage/setSingleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('updated');
            done();
        });
    });
    test('set doc single js', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            doc: 'single',
            data: path.join(process.cwd(), './cloud/storage/setSingleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('updated');
            done();
        });
    });
    test('set multiple json', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './cloud/storage/setMultipleData.json'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('updated');
            done();
        });
    });
    test('set multiple js', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setMultipleData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('updated');
            done();
        });
    });
    test('set missing data', () => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('set data not exists', () => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: './notExists.file'
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        expect(plugin.init(cmd)).toBeUndefined();
    });
    test('set data only doc', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setOnlyDocData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
        }, function (error) {
            expect(error).toBeUndefined();
            done();
        });
    });
    test('set data only set', (done) => {
        let cmd = ['database', 'set'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setOnlySetData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
            expect(Object.keys(results[0])).toContain('updated');
            done();
        });
    });
    test('update data only set', (done) => {
        let cmd = ['database', 'update'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null, path: PATH_CONFIG }, {
            _: cmd,
            collection: 'user',
            data: path.join(process.cwd(), './cloud/storage/setOnlySetData.js')
        });
        plugin.initAdminSDKDatabase = mockInitAdminSDKDatabase();
        plugin.init(cmd).then(function (results) {
        }, function (error) {
            expect(error).toBeUndefined();
            done();
        });
    });
});