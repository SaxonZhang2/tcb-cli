const BaseClient = require('../base');
const adminSDK = require('tcb-admin-node');


class Database extends BaseClient {
    constructor(config = {}, argv) {
        super(config.env);
        this.config = config;
        this.argv = argv;
        this.adminSDK = adminSDK;
    }

    /**
     * 命令处理入口
     */
    init(cmd) {

    }

    add() {

    }
}

module.exports = Database;