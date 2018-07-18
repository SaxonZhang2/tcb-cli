const fs = require('fs-extra');
const {
    CUR_PATH,
    PROJECTS_PATH,
    TEMPLATE_PATH
} = require('./constants');
let Plugin = require('../src/libs/storage');

beforeAll(() => {
    process.chdir(PROJECTS_PATH);
});

afterAll(() => {
    fs.removeSync(TEMPLATE_PATH);
    process.chdir(CUR_PATH);
});

describe('storage', () => {
    it('create project', () => {
        // let cmd = ['storage'];
        // let plugin = new Plugin({}, {
        //     _: cmd
        // });
        // plugin.init();
    });
});