const path = require('path');
const {
    CUR_PATH,
    FUNCTIONS_PATH,
    EMPTY_CONFIG
} = require('./constants');
const {
    FUNC_NAME_MISSING,
    FILE_MISSING,
    DATA_FORMAT,
} = require('../src/common/message');
let Plugin = require('../src/libs/functions');

jest.mock('child_process');

beforeAll(() => {
    process.chdir(FUNCTIONS_PATH);
});

afterAll(() => {
    process.chdir(CUR_PATH);
});

describe('functions', () => {
    it('call function with data', () => {
        let cmd = ['functions', 'call', 'test-function'];
        let plugin = new Plugin(EMPTY_CONFIG, {
            _: cmd,
            data: JSON.stringify({
                a: 1,
                b: 2
            })
        });
        plugin.log = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual({
                mpAppId: null,
                envName: null,
                secretId: null,
                secretKey: null
            });
            return this;
        });
        let data = {
            data: { response_data: 'Hello World' },
            requestId: '123'
        };
        plugin.adminSDK.callFunction = jest.fn((params) => {
            expect(params).toEqual({ data: { a: 1, b: 2 }, name: 'test-function' });
            return new Promise((resolve) => {
                resolve(data);
            });
        });
        plugin.init(cmd).then(() => {
            let result = JSON.parse(plugin.log.mock.calls[0][0]);
            expect(result).toEqual(data);
        });
    });

    it('call function with data file', () => {
        let cmd = ['functions', 'call', 'test-function'];
        let plugin = new Plugin(EMPTY_CONFIG, {
            _: cmd,
            file: './data.json'
        });
        plugin.log = jest.fn();
        plugin.adminSDK.init = jest.fn((options) => {
            expect(options).toEqual({
                mpAppId: null,
                envName: null,
                secretId: null,
                secretKey: null
            });
            return this;
        });
        let data = {
            data: { response_data: 'Hello World' },
            requestId: '123'
        };
        plugin.adminSDK.callFunction = jest.fn((params) => {
            expect(params).toEqual({ data: { a: 1 }, name: 'test-function' });
            return new Promise((resolve) => {
                resolve(data);
            });
        });
        plugin.init(cmd).then(() => {
            let result = JSON.parse(plugin.log.mock.calls[0][0]);
            expect(result).toEqual(data);
        });
    });

    // 主要由 scf-node-debug 负责具体单测
    it('debug function', () => {
        let cmd = ['functions', 'debug'];
        let plugin = new Plugin(EMPTY_CONFIG, {
            _: cmd
        });
        plugin.init(cmd);
    });

    it('function name missing', () => {
        let cmd = ['functions', 'call'];
        let plugin = new Plugin(EMPTY_CONFIG, {
            _: cmd
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(FUNC_NAME_MISSING);
        });
        return plugin.init(cmd);
    });

    it('file missing', () => {
        let cmd = ['functions', 'call', 'test-function'];
        let plugin = new Plugin(EMPTY_CONFIG, {
            _: cmd,
            file: './data1.json'
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(`${path.join(FUNCTIONS_PATH, 'data1.json')}: ${FILE_MISSING}`);
        });
        return plugin.init(cmd);
    });

    it('data format error from file', () => {
        let cmd = ['functions', 'call', 'test-function'];
        let plugin = new Plugin(EMPTY_CONFIG, {
            _: cmd,
            file: './data-error.json'
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(DATA_FORMAT);
        });
        return plugin.init(cmd);
    });

    it('data format error from data', () => {
        let cmd = ['functions', 'call', 'test-function'];
        let plugin = new Plugin(EMPTY_CONFIG, {
            _: cmd,
            data: '{a:1}'
        });
        plugin.error = jest.fn((msg) => {
            expect(msg).toEqual(DATA_FORMAT);
        });
        return plugin.init(cmd);
    });
});