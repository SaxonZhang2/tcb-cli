# tcb-cli

Tencent Cloud Base 命令行工具。

[![NPM Version](https://img.shields.io/npm/v/tcb-cli.svg?style=flat)](https://www.npmjs.com/package/tcb-cli)
[![Travis](https://img.shields.io/travis/TencentCloudBase/tcb-cli.svg)](https://travis-ci.org/TencentCloudBase/tcb-cli)
[![Deps](https://david-dm.org/TencentCloudBase/tcb-cli.svg)](https://img.shields.io/TencentCloudBase/tcb-cli)
[![Coverage](https://img.shields.io/coveralls/TencentCloudBase/tcb-cli.svg)](https://coveralls.io/github/TencentCloudBase/tcb-cli)


## 功能

### init 初始化tcb项目

* 以下是允许初始化的项目
    - 小程序
    - 小程序插件

* 项目结构和配置内容

```javascript

project 
 |-- client // 客户端代码，包括小程序端，未来的 Web, Android, IOS
 |-- server // 服务端代码
 |-- cloud // 小程序云相关功能代码片段
 |    |- storage // 对象存储
 |    |- database // 数据库
 |    |- functions // 云函数
 |
 |-- tcb.json // tcb 配置

// tcb.json
// 以下是官方推荐的配置内容
{
    "path": {
      "storage": "./cloud/storage",
      "database": "./cloud/database",
      "functions": "./cloud/functions"
    }
    /**
     * 其它配置
     */
}
```
[init 样例](./docs/init.md)

### database 数据库

| 命令 | 介绍
| --- | ---
| **database add** | 添加单个/批量数据
| **database remove** | 删除单个/批量数据
| **database update** | 更新单个/批量数据
| **database set** | 更新或创建单个/批量数据

[database 样例](./docs/database.md)

### storage 文件

| 命令 | 介绍
| --- | ---
| **storage upload --file [file path]** | 上传文件
| **storage upload --folder [folder path]** | 上传文件夹
| **storage upload --batch** | 批量上传文件

[storage 样例](./docs/database.md)

### functions 云函数

| 命令 | 介绍
| --- | ---
| **functions debug** | 云函数本地调试
| **functions call [function name] --data [data]** | 调用云函数
| **functions call [function name] --file [data file]** | 调用云函数

[functions 样例](./docs/functions.md)

### config 配置

| 命令 | 介绍
| --- | ---
| **config add key=value --global** | 添加配置
| **config update key=value --global** | 更新配置
| **config remove key --global** | 删除配置
| **config list --global** | 罗列配置

### 注意
storage 和 database 是批量操作，由于底层未支持批量操作的接口，目前只是做了简单封装，因此文件和数据的指操作会比消耗 API 使用量，请谨慎使用。

### help 帮助

```javascript
tcb help
```

### tcb.json 配置项目

```javascript
{
    "path": {
      "storage": "./cloud/storage", // 文件存放目录
      "database": "./cloud/database", // 数据库数据目录
      "functions": "./cloud/functions" // 云函数目录
    },
    "proxy": "", // http 代理
    "https_proxy": "", // https 代理
    "mpappid": "", // 小程序 appid
    "env": "", // 小程序云环境 id
    "secretid": "", // 腾讯云 secretid
    "secretkey": "", // 腾讯云 secretkey
}
```

## 开发

```javascript
// 模拟安装后，运行后置脚本，设置全局配置
npm run postinstall

// 开发命令行，将命令 link 至全局
npm link
```

## 测试
```javascript
npm test
```

