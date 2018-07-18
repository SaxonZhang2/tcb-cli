const fs = require('fs-extra');
const {
    CUR_PATH,
    PROJECTS_PATH,
    TEMPLATE_PATH
} = require('./constants');
let Plugin = require('../src/libs/init');

beforeAll(() => {
    process.chdir(PROJECTS_PATH);
});

afterAll(() => {
    fs.removeSync(TEMPLATE_PATH);
    process.chdir(CUR_PATH);
});

let userInfo = {
    input: [],
    addInput(key, val) {
        this.input.push({
            key,
            val
        });
    },
    runInput(done) {
        let len = this.input.length;
        let incre = 200;
        let useTime = 0;
        let time = (len + 1) * incre;

        let timer = setInterval(() => {
            useTime += incre;

            if (this.input.length) {
                let kv = this.input.shift();
                process.stdin.resume();
                process.stdin.emit(kv.key, kv.val);
            }

            if (useTime >= time) {
                clearInterval(timer);
                done();
            }

        }, incre);
    }
};

describe('init', () => {
    it('create project', (done) => {
        let cmd = ['init'];
        let plugin = new Plugin({}, {
            _: cmd
        });
        plugin.init();

        userInfo.addInput('data', '123\n');
        userInfo.addInput('data', '234\n');
        userInfo.addInput('data', '345\n');
        userInfo.addInput('data', '456\n');
        userInfo.addInput('data', 'template\n');

        userInfo.runInput(() => {
            let tcbJson = require('./projects/template/tcb.json');
            let projectJson = require('./projects/template/project.config.json');
            expect(tcbJson).toEqual({
                'mpappid': '123',
                'env': '234',
                'secretid': '345',
                'secretkey': '456',
                path: {
                    storage: './cloud/storage',
                    database: './cloud/database',
                    functions: './cloud/functions'
                }
            });
            expect(projectJson.appid).toBe('123');
            done();
        });
    });
});