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
```javascript
```

