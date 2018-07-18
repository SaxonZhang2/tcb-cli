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
        let cmd = ['storage'];
        let plugin = new Plugin({}, {
            _: cmd
        });
        plugin.init();
    });
});