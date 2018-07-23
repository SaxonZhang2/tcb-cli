## 数据库 database
### 对集合（collection）中的文档（document）进行相关操作

### 项目结构
假设我们用如下一个项目
```javascript
// 目录
project
|-client
|-cloud
|  |-database
|     |-data.json
|     |-data.js
|  |-functions
|  |-storage
|-server
|-tcb.json

// tcb.json 配置
/**
 * 我们推荐将文件、数据库初始数据、云函数放置到以下的目录中，这样比较容易做好存当和方便命令行的调用
 * 你也可以自定义这些目录的位置，但推荐使用官方定义好的目录
 * 以下例子中的文件目录，除了特殊说明，均为推荐目录
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
#### 添加文档 add
```javascript
// 向集合user添加单个文档，数据源自推荐目录 /cloud/database/data.json
tcb database add --colleciton user --data data.json
// user.json
{
    "name": "eno",
    "sex": "male"
}
// 也可以将数据源指定为其他位置，比如当前目录下的 data.js
tcb database add --colleciton user --data ./data.js
// user.js
module.exports = {
    name: 'eno',
    sex: 'male'
};

// 向集合user批量添加文档，数据源自 D盘根目录下的 data.json
tcb database add --colleciton user --data D:/data.json
// users.json 
[
    {
        "name": "eno",
        "sex": "male"
    },
    {
        "name": 'justan',
        "sex": "male"
    }
]

tcb database add --colleciton user --data data.js
// users.js
module.exports = [
    {
        name: 'eno',
        sex: () => {
            return 'male';
        }
    },
    {
        name: 'justan',
        sex: 'male'
    }
];
```
#### 删除文档 remove
```javascript
// 删除集合user下id为abc的文档
tcb database remove --colleciton user --doc abc

tcb database remove --colleciton user --data data.json
// data.json
{
    "doc": "abc"
}

tcb database remove --colleciton user --data data.js
// data.js
module.exports = {
    doc: 'abc'
};

// 批量删除集合user下id分别为 abc、123、abc123的文档
tcb database remove --colleciton user --data data.json
// data.json
[
    {
        "doc": "abc"
    },
    {
        "doc": "123"
    },
    {
        "doc": "abc123"
    }
]

tcb database remove --colleciton user --data data.js
// data.js
module.exports = [
    {
        doc: 'abc'
    },
    {
        doc: '123'
    },
    {
        doc: 'abc123'
    }
];
```
#### 更新文档 update
```javascript
// 更新集合user下id为abc的文档数据

// 命令行参数指定文档，更新的数据为文件内容
tcb database update --colleciton user --doc abc --data data.json
// user.json
{
    "name": "eno",
    "sex": "male"
}

tcb database update --colleciton user --doc abc --data data.js
// user.js
module.exports = {
    name: 'eno',
    sex: 'male'
};

// 文件内容中指定文档 doc，更新数据为set对象
tcb database update --colleciton user --data data.json
// user.json
{
    "doc": "abc",
    "set": {
        "name": "eno",
        "sex": "male"
    }
}

tcb database update --colleciton user --data data.js
// user.js
module.exports = {
    doc: 'abc',
    set: {
        name: 'eno',
        sex: 'male'
    }
};

// 批量更新集合user下id分别为 abc、123、abc123的文档，更新数据为set对象
tcb database update --colleciton user --data data.json
// data.json
[
    {
        "doc": "abc",
        "set": {
            "name": "eno",
            "sex": "male"
        }
    },
    {
        "doc": "123",
        "set": {
            "name": "hey",
            "sex": "male"
        }
    },
    {
        "doc": "abc123",
        "set": {
            "name": "louis",
            "sex": "male"
        }
    }
]

tcb database update --colleciton user --data data.js
// data.js
module.exports = [
    {
        doc: 'abc',
        set: {
            name: "eno",
            sex: "male"
        }
    },
    {
        doc: '123',
        set: {
            name: "hey",
            sex: "male"
        }
    },
    {
        doc: 'abc123',
        set: {
            name: 'louis',
            sex: 'male'
        }
    }
];
```
#### 创建或更新文档 set
```javascript
// set命令与以上update命令用法相同，区别仅在于当set可以不指定文档
// 当集合user不存在文档时，以下命令效果等同于add
// 当集合user存在文档时，以下命令将更新集合user中第一个文档
tcb database set --colleciton user --data data.json
// user.json
{
    "name": "eno",
    "sex": "male"
}
```