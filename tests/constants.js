const path = require('path');

const CUR_PATH = process.cwd();
const GLOBAL_PATH = path.resolve('./tests/projects/global');
const PROJECT_PATH = path.resolve('./tests/projects/project');

exports.CUR_PATH = CUR_PATH;
exports.PROJECT_PATH = PROJECT_PATH;
exports.GLOBAL_PATH = GLOBAL_PATH;