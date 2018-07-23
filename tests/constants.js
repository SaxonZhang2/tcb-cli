const path = require('path');

const CUR_PATH = process.cwd();
const GLOBAL_PATH = path.resolve('./tests/projects/global');
const PROJECTS_PATH = path.resolve('./tests/projects');
const PROJECT_PATH = path.resolve('./tests/projects/project');
const TEMPLATE_PATH = path.resolve('./tests/projects/template');
const STORAGE_PATH = path.resolve('./tests/projects/storage');
const FUNCTIONS_PATH = path.resolve('./tests/projects/functions');
const DATABASE_PATH = path.resolve('./tests/projects/database');
exports.CUR_PATH = CUR_PATH;
exports.PROJECTS_PATH = PROJECTS_PATH;
exports.PROJECT_PATH = PROJECT_PATH;
exports.GLOBAL_PATH = GLOBAL_PATH;
exports.TEMPLATE_PATH = TEMPLATE_PATH;
exports.STORAGE_PATH = STORAGE_PATH;
exports.FUNCTIONS_PATH = FUNCTIONS_PATH;
exports.DATABASE_PATH = DATABASE_PATH;


exports.PATH_CONFIG = {
    storage: './cloud/storage',
    database: './cloud/database',
    functions: './cloud/functions'
};

exports.NULL_CONFIG = {
    mpAppId: null,
    envName: null,
    secretId: null,
    secretKey: null
};