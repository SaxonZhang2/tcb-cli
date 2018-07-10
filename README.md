# tcb-cli

[![NPM Version](https://img.shields.io/npm/v/tcb-cli.svg?style=flat)](https://www.npmjs.com/package/tcb-cli)
[![Travis](https://img.shields.io/travis/tencentcloudbase/tcb-cli.svg)](https://travis-ci.org/tencentcloudbase/tcb-cli)
[![Deps](https://david-dm.org/tencentcloudbase/tcb-cli.svg)](https://img.shields.io/tencentcloudbase/tcb-cli)
[![Coverage](https://img.shields.io/coveralls/tencentcloudbase/tcb-cli.svg)](https://coveralls.io/github/tencentcloudbase/tcb-cli)


## 功能

### init 初始化tcb项目

* 以下是允许初始化的项目
    - 小程序
    - 小程序插件

* 项目结构

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

```

## database 数据库

| 命令 | 介绍
| --- | ---
| **database:add** | 添加单个/批量数据
| **database:remove** | 删除单个/批量数据

### storage 对象存储

| 命令 | 介绍
| --- | ---
| **storage:upload --file [file path] --folder [folder path]** | 上传文件
| **storage:upload --folder [folder path]** | 上传文件夹
| **storage:upload --batch** | 批量上传文件

### functions 云函数

| 命令 | 介绍
| --- | ---
| **function:debug** | 云函数本地调试
| **functions:call [function name] --data [function data]** | 调用云函数
| **functions:deploy [function name]** | 调用云函数

### help 帮助

```javascript
tcb help
```
