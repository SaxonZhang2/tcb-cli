const path = require('path');
const BaseClient = require('../base');

class Config extends BaseClient {
    constructor(config = {}) {
        super(config.env);
        this.config = config;
    }

    init() {

    }
}

module.exports = Config;