## 文件 storage

### 项目结构
假设我们用如下一个项目
```javascript
// 目录
project
|-client
|-cloud
|  |-database
|  |-functions
|  |-storage
|     |-image.png
|     |-icon
|        |-wechat.png
|        |-qq.png
|-server
|-tcb.json

// tcb.json 配置
/**
 * 我们推荐将文件、数据库初始数据、云函数放置到以下的目录中，这样比较容易做好存当和方便命令行的调用
 * 你也可以自定义这些目录的位置，但推荐使用官方定义好的目录
 */
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

### 上传单个文件
```javascript
// 将 /cloud/storage/image.png 上传至云端 /cloud/storage/image.png
tcb storage upload --file image.png

// 当然你也可以将其它位置的文件单独上传，比如将当前目录下的 image.png 图片上传至云端 /image.png 目录
tcb storage upload --file ./image.png

```

### 上传文件夹
```javascript
// 将 /cloud/storage/icon 上传至云端 /cloud/storage/icon
tcb storage upload --folder icon

// 你也可以将其它位置的文件夹单独上传，比如将当前目录下的 icon 目录上传到云端 /icon 目录
tcb storage upload --folder icon
```

### 将 /cloud/storage 目录整体上传
```javascript
// 将 /cloud/storage/ 上传至云端 /cloud/storage
tcb storage upload --batch
```

### 限制
* 单次上传文件上限为100个
* 单个文件的大小上限为 50 GB