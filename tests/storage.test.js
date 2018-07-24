const fs = require('fs-extra');
const {
    CUR_PATH,
    STORAGE_PATH,
    PATH_CONFIG,
    NULL_CONFIG
} = require('./constants');
const {
    FILE_MISSING,
    UPLOAD_SUCCESS,
    FILE_NUM_LIMIT,
    FILE_SIZE_LIMIT,
    FOLDER_EMPTY
} = require('../src/common/message');
let Plugin = require('../src/libs/storage');

beforeAll(() => {
    process.chdir(STORAGE_PATH);
});

afterAll(() => {
    process.chdir(CUR_PATH);
});

describe('storage', () => {
    it('upload file', () => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            file: 'wechat.png'
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(NULL_CONFIG);
            return this;
        });
        plugin.adminSDK.uploadFile = jest.fn((params) => {
            return new Promise((resolve) => {
                resolve(JSON.stringify({
                    data: {
                        message: 'SUCCESS',
                        fileid: 'testenv-123/cloud/storage/wechat.png',
                        url: 'https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png'
                    }
                }));
            });
        });
        plugin.init(cmd).then(() => {
            let result = `wechat.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png: ${UPLOAD_SUCCESS}`;
            expect(plugin.spinSucceed.mock.calls[0][0]).toEqual(result);
        });
    });

    it('upload folder', () => {
        let config = {
            mpAppId: null,
            envName: null,
            secretId: null,
            secretKey: null
        };
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            folder: 'icon'
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(NULL_CONFIG);
            return this;
        });

        let count = 0;
        plugin.adminSDK.uploadFile = jest.fn((params) => {
            return new Promise((resolve) => {
                let data = {};
                switch (count) {
                    case 0: {
                        data = {
                            data: {
                                message: 'SUCCESS',
                                fileid: 'testenv-123/cloud/storage/wechat.png',
                                url: 'https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png'
                            }
                        };
                        break;
                    }
                    case 1: {
                        data = {
                            data: {
                                message: 'SUCCESS',
                                fileid: 'testenv-123/cloud/storage/apple.png',
                                url: 'https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/apple.png'
                            }
                        };
                        break;
                    }
                }
                ++count;
                resolve(JSON.stringify(data));
            });
        });
        plugin.init(cmd).then(() => {
            let result0 = `apple.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png: ${UPLOAD_SUCCESS}`;
            let result1 = `wechat.png\nfileId: testenv-123/cloud/storage/apple.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/apple.png: ${UPLOAD_SUCCESS}`;
            expect(plugin.spinSucceed.mock.calls[0][0]).toEqual(result0);
            expect(plugin.spinSucceed.mock.calls[1][0]).toEqual(result1);
        });
    });

    it('upload batch', () => {
        let config = {
            mpAppId: null,
            envName: null,
            secretId: null,
            secretKey: null
        };
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            batch: true
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(NULL_CONFIG);
            return this;
        });

        let count = 0;
        plugin.adminSDK.uploadFile = jest.fn((params) => {
            return new Promise((resolve) => {
                let data = {};
                switch (count) {
                    case 0: {
                        data = {
                            data: {
                                message: 'SUCCESS',
                                fileid: 'testenv-123/cloud/storage/apple.png',
                                url: 'https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/apple.png'
                            }
                        };
                        break;
                    }
                    case 1: {
                        data = {
                            data: {
                                message: 'SUCCESS',
                                fileid: 'testenv-123/cloud/storage/apple.png',
                                url: 'https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/icon/apple.png'
                            }
                        };
                        break;
                    }
                    case 2: {
                        data = {
                            data: {
                                message: 'SUCCESS',
                                fileid: 'testenv-123/cloud/storage/wechat.png',
                                url: 'https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png'
                            }
                        };
                        break;
                    }
                    case 3: {
                        data = {
                            data: {
                                message: 'SUCCESS',
                                fileid: 'testenv-123/cloud/storage/wechat.png',
                                url: 'https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/icon/wechat.png'
                            }
                        };
                        break;
                    }
                }
                ++count;
                resolve(JSON.stringify(data));
            });
        });
        plugin.init(cmd).then(() => {
            let result0 = `apple.png\nfileId: testenv-123/cloud/storage/apple.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/apple.png: ${UPLOAD_SUCCESS}`;
            let result1 = `apple.png\nfileId: testenv-123/cloud/storage/apple.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/icon/apple.png: ${UPLOAD_SUCCESS}`;
            let result2 = `wechat.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png: ${UPLOAD_SUCCESS}`;
            let result3 = `wechat.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/icon/wechat.png: ${UPLOAD_SUCCESS}`;
            expect(plugin.spinSucceed.mock.calls[0][0]).toEqual(result0);
            expect(plugin.spinSucceed.mock.calls[1][0]).toEqual(result1);
            expect(plugin.spinSucceed.mock.calls[2][0]).toEqual(result2);
            expect(plugin.spinSucceed.mock.calls[3][0]).toEqual(result3);
        });
    });

    it('file missing', () => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            file: 'wechat1.png'
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(`${plugin.appendPath('wechat1.png')}: ${FILE_MISSING}`);
        });
        return plugin.init(cmd);
    });

    it('file number exceed limit', (done) => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            folder: 'icon'
        });
        plugin.getFiles = jest.fn().mockImplementationOnce(() => {
            let arr = [];
            for (let i = 0, len = 101; i < len; i++) {
                arr.push(`file${i}.png`);
            }
            return arr;
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(`${FILE_NUM_LIMIT}: 100。`);
        });
        plugin.init(cmd).then(() => {
            plugin.getFiles.mockRestore();
            done();
        });
    });

    it('folder file size exceed limit', () => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            folder: 'icon'
        });
        plugin.checkSize = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(`${FILE_SIZE_LIMIT}: 50GB。`);
        });
        return plugin.init(cmd);
    });

    it('file size exceed limit', () => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            file: 'wechat.png'
        });
        plugin.checkSize = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(`${FILE_SIZE_LIMIT}: 50GB。`);
        });
        return plugin.init(cmd);
    });

    it('folder empty', () => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            folder: 'empty'
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(`${FOLDER_EMPTY}`);
        });
        return plugin.init(cmd);
    });

    it('upload file fail with code', (done) => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            file: 'wechat.png'
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.spinFail = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(NULL_CONFIG);
            return this;
        });
        plugin.adminSDK.uploadFile = jest.fn((params) => {
            return new Promise((resolve) => {
                resolve(JSON.stringify({
                    code: 1,
                    message: 'error'
                }));
            });
        });

        plugin.init(cmd).then(() => {
            expect(plugin.spinFail.mock.calls[0][0]).toEqual(`error: ${plugin.appendPath('wechat.png')}`);
            done();
        });
    });

    it('upload file fail', (done) => {
        let cmd = ['storage', 'upload'];
        let plugin = new Plugin({
            env: null,
            mpappid: null,
            secretid: null,
            secretkey: null,
            path: PATH_CONFIG
        }, {
            _: cmd,
            file: 'wechat.png'
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.spinFail = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(NULL_CONFIG);
            return this;
        });
        plugin.adminSDK.uploadFile = jest.fn((params) => {
            return new Promise((resolve) => {
                resolve(JSON.stringify({
                    data: {
                        message: 'fail'
                    }
                }));
            });
        });

        plugin.init(cmd).then(() => {
            expect(plugin.spinFail.mock.calls[0][0]).toEqual(`fail: ${plugin.appendPath('wechat.png')}`);
            done();
        });
    });
});