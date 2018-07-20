const {
    CUR_PATH,
    FUNCTIONS_PATH,
} = require('./constants');
let Plugin = require('../src/libs/functions');

beforeAll(() => {
    process.chdir(FUNCTIONS_PATH);
});

afterAll(() => {
    process.chdir(CUR_PATH);
});

describe('functions', () => {
    it('call function with data', () => {
        let cmd = ['functions', 'call', 'test-function'];
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
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
        let plugin = new Plugin({ env: null, mpappid: null, secretid: null, secretkey: null }, {
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
});