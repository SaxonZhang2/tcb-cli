const {
    CUR_PATH,
    GLOBAL_PATH,
    PROJECT_PATH
} = require('./constants');
let Plugin = require('../src/libs/config');

beforeAll(() => {
    process.chdir(PROJECT_PATH);
});

describe('config', () => {

    beforeEach(() => {
        jest.resetModules(); // Resets the module registry - the cache of all required modules.
        let plugin = new Plugin({ env: null }, {
            _: []
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.createConfig({
            a: 1,
            b: 2
        }, {
            isGlobal: true,
            overwrite: true,
        });

        plugin.createConfig({
            a: 3,
            b: 4,
            c: 3
        }, {
            overwrite: true
        });
    });

    test('list local config', () => {
        let cmd = ['config', 'list'];
        let plugin = new Plugin({ env: null }, {
            _: cmd
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.warn = jest.fn();
        plugin.init(cmd);
        expect(plugin.warn.mock.calls[0][0]).toBe(JSON.stringify({
            a: 3,
            b: 4,
            c: 3
        }, null, 4));
    });

    test('list global config', () => {
        let cmd = ['config', 'list'];
        let plugin = new Plugin({ env: null }, {
            _: cmd,
            global: true
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.warn = jest.fn();
        plugin.init(cmd);
        expect(plugin.warn.mock.calls[0][0]).toBe(JSON.stringify({
            a: 1,
            b: 2
        }, null, 4));
    });

    test('add local config', () => {
        let cmd = ['config', 'add', 'd=5'];
        let plugin = new Plugin({ env: null }, {
            _: cmd
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.init(cmd);
        expect(plugin.readConfig()).toEqual({ a: 3, b: 4, c: 3, d: '5' });
    });

    test('add global config', () => {
        let cmd = ['config', 'add', 'd=5'];
        let plugin = new Plugin({ env: null }, {
            _: cmd,
            global: true
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.init(cmd);

        expect(plugin.readConfig({
            isGlobal: true
        })).toEqual({ a: 1, b: 2, d: '5' });
    });

    test('update local config - key not exists', () => {
        let cmd = ['config', 'update', 'd=5'];
        let plugin = new Plugin({ env: null }, {
            _: cmd
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.init(cmd);
        expect(plugin.readConfig()).toEqual({ a: 3, b: 4, c: 3 });
    });

    test('update local config', () => {
        let cmd = ['config', 'update', 'b=5'];
        let plugin = new Plugin({ env: null }, {
            _: cmd
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.init(cmd);
        expect(plugin.readConfig()).toEqual({ a: 3, b: '5', c: 3 });
    });

    test('update global config', () => {
        let cmd = ['config', 'update', 'a=2'];
        let plugin = new Plugin({ env: null }, {
            _: cmd,
            global: true
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.init(cmd);
        expect(plugin.readConfig({
            isGlobal: true
        })).toEqual({ a: '2', b: 2 });
    });

    test('remove local config', () => {
        let cmd = ['config', 'remove', 'a'];
        let plugin = new Plugin({ env: null }, {
            _: cmd
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.init(cmd);
        expect(plugin.readConfig()).toEqual({ a: 1, b: 4, c: 3 });
    });

    test('remove global config', () => {
        let cmd = ['config', 'remove', 'a'];
        let plugin = new Plugin({ env: null }, {
            _: cmd,
            global: true
        });
        plugin.getGlobalHome = jest.fn(() => {
            return GLOBAL_PATH;
        });
        plugin.init(cmd);
        expect(plugin.readConfig({
            isGlobal: true
        })).toEqual({ b: 2 });
    });
});

afterAll(() => {
    process.chdir(CUR_PATH);
});