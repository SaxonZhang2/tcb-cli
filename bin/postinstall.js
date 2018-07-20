// 初始化全局配置
const BaseClient = require('../src/base');

let client = new BaseClient(null);
let globalConfigPath = client.getGlobalConfigPath();

if (!client.fs.existsSync(globalConfigPath)) {
    client.createConfig({
        path: {
            storage: './cloud/storage',
            database: './cloud/database',
            functions: './cloud/functions'
        }
    }, {
        overwrite: true,
        isGlobal: true
    });
}