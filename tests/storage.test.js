const fs = require('fs-extra');
const {
    CUR_PATH,
    PROJECTS_PATH,
    STORAGE_PATH
} = require('./constants');
let Plugin = require('../src/libs/storage');

beforeAll(() => {
    process.chdir(STORAGE_PATH);
});

afterAll(() => {
    process.chdir(CUR_PATH);
});

describe('storage', () => {
    it('upload file', () => {
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
            path: {
                storage: './cloud/storage',
                database: './cloud/database',
                functions: './cloud/functions'
            }
        }, {
            _: cmd,
            file: 'wechat.png'
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(config);
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
            let result = 'wechat.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png';
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
            path: {
                storage: './cloud/storage',
                database: './cloud/database',
                functions: './cloud/functions'
            }
        }, {
            _: cmd,
            folder: 'icon'
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(config);
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
            let result0 = 'apple.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png';
            let result1 = 'wechat.png\nfileId: testenv-123/cloud/storage/apple.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/apple.png';
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
            path: {
                storage: './cloud/storage',
                database: './cloud/database',
                functions: './cloud/functions'
            }
        }, {
            _: cmd,
            batch: true
        });
        plugin.spinStart = jest.fn();
        plugin.spinSucceed = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual(config);
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
            let result0 = 'apple.png\nfileId: testenv-123/cloud/storage/apple.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/apple.png';
            let result1 = 'apple.png\nfileId: testenv-123/cloud/storage/apple.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/icon/apple.png';
            let result2 = 'wechat.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/wechat.png';
            let result3 = 'wechat.png\nfileId: testenv-123/cloud/storage/wechat.png\nfileUrl: https://testenv-123.cos.ap-shanghai.myqcloud.com/cloud/storage/icon/wechat.png';
            expect(plugin.spinSucceed.mock.calls[0][0]).toEqual(result0);
            expect(plugin.spinSucceed.mock.calls[1][0]).toEqual(result1);
            expect(plugin.spinSucceed.mock.calls[2][0]).toEqual(result2);
            expect(plugin.spinSucceed.mock.calls[3][0]).toEqual(result3);
        });
    });
});