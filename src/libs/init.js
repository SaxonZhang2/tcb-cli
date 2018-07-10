const inquirer = require('inquirer');
const path = require('path');
const glob = require('glob');
const BaseClient = require('../base');
let {
    Q_MPAPPID,
    Q_ENV,
    Q_SECRETID,
    Q_SECRETKEY,
    Q_PROJECT
} = require('../common/questions');
let {
    checkInput
} = require('../common/utils');

class Init extends BaseClient {
    constructor(config = {}) {
        super(config.env);
        this.config = config;
    }

    init() {
        inquirer.prompt([
            Q_MPAPPID,
            Q_ENV,
            Q_SECRETID,
            Q_SECRETKEY,
            Q_PROJECT
        ]).then((answers) => {

            if (checkInput.bind(this)(answers)) {
                return;
            }

            const {
                mpappid,
                env,
                secretid,
                secretkey,
                project
            } = answers;

            let srcPath = path.join(__dirname, '../../templates/project/');
            let destPath = path.join(process.cwd(), project);

            if (this.fs.existsSync(destPath)) {
                return this.error(`${destPath} exists.`);
            }

            this.fs.copySync(srcPath, destPath);

            let files = glob.sync(path.join(destPath, '**/*'), {
                nodir: true
            });

            files.forEach((item) => {
                let content = this.fs.readFileSync(item);
                let compiledContent = this._.template(content)({
                    project: project,
                    mpappid: mpappid,
                    env: env,
                    secretid: secretid,
                    secretkey: secretkey
                });
                this.fs.ensureFileSync(item);
                this.fs.writeFileSync(item, compiledContent, 'utf-8');
            });

            this.config = {
                ...this.config,
                mpappid,
                env,
                secretid,
                secretkey
            };

            this.createConfig(this.config, {
                folder: destPath
            });

        }).catch((e) => {
            this.error(e.stack);
        });
    }
}

module.exports = Init;