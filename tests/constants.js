const path = require('path');

const CUR_PATH = process.cwd();
const GLOBAL_PATH = path.resolve('./tests/projects/global');
const PROJECTS_PATH = path.resolve('./tests/projects');
const PROJECT_PATH = path.resolve('./tests/projects/project');
const TEMPLATE_PATH = path.resolve('./tests/projects/template');

exports.CUR_PATH = CUR_PATH;
exports.PROJECTS_PATH = PROJECTS_PATH;
exports.PROJECT_PATH = PROJECT_PATH;
exports.GLOBAL_PATH = GLOBAL_PATH;
exports.TEMPLATE_PATH = TEMPLATE_PATH;