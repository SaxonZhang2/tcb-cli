## 云函数 functions

### 调用云函数
```javascript
// 调用函数名为 test 的云函数
tcb functions call test

// 调用函数名为 test 的云函数，且带上参数 {a:1}
tcb functions call test --data "{\"a\": 1}"

// 调用函数名为 test  的云函数，且带上文件 data.json 里的参数
tcb functions call test --file ./data.json
```

### 调试云函数
**仅需3步即可开启调试**
```javascript
// Step 1 - 初始化调试工具
tcb functions debug

// Step 2 - 在交互式命令行的引导下依次填写入口文件地址、执行方法、超时时间、测试模版
? 请输入入口文件地址(相对路径) ./test/mock/timeoutDemo.js
? 请输入入口执行方法名称 main_handler
? 请输入超时时间限制(单位：s) 3
? 请选择测试模版 http

// Step 3 - 默认在本地3000端口启动调试server，将请求转发到本地3000端口就可以开始调试啦
[Weapp CLI][2018-07-23T21:06:07+08:00] Server has listened [IP]:localhost [PORT]:3000. http://localhost:3000

```

