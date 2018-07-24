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
const {
    FOLDER_EXIST
} = require('../common/message');
let {
    checkInput
} = require('../common/utils');

class Init extends BaseClient {
    constructor(config = {}) {
        super(config.env);
        this.config = config;
    }

    /**
     * 命令处理入口
     */
    init() {
        inquirer.prompt([
            Q_MPAPPID,
            Q_ENV,
            Q_SECRETID,
            Q_SECRETKEY,
            Q_PROJECT
        ]).then((answers) => {
            this.create(answers);

        }).catch((e) => {
            this.error(e.stack);
        });
    }

    /**
     * 通过模板生成项目
     * @param {Object} options 配置
     */
    create(options = {}) {
        let msg = checkInput(options, ['mpappid', 'project', 'env', 'secretid', 'secretkey']);
        if (msg) {
            return this.error(msg);
        }

        const {
            mpappid,
            env,
            secretid,
            secretkey,
            project
        } = options;

        let srcPath = path.join(__dirname, '../../templates/project/');
        let destPath = path.join(process.cwd(), project);

        if (this.fs.existsSync(destPath)) {
            return this.error(`${destPath}: ${FOLDER_EXIST}`);
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
            mpappid,
            env,
            secretid,
            secretkey,
            path: {
                storage: './cloud/storage',
                database: './cloud/database',
                functions: './cloud/functions'
            }
        };

        this.createConfig(this.config, {
            folder: destPath,
            isLocal: true,
        });
    }
}

module.exports = Init;