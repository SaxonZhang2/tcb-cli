## 数据库 database
### 对集合（collection）中的文档（document）进行相关操作
添加文档 add
```javascript
// 向集合user添加单个文档
tcb database add --colleciton user --data ./user.json
// user.json
{
    "name": "eno",
    "sex": "male"
}

tcb database add --colleciton user --data ./user.js
// user.js
module.exports = {
    name: 'eno',
    sex: 'male'
}

// 向集合user批量添加文档
tcb database add --colleciton user --data ./users.json
// users.json 
[
    {
        "name": "eno",
        "sex": "male"
    },
    {
        "name": 'jus',
        "sex": "male"
    }
]

tcb database add --colleciton user --data ./users.js
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
删除文档 remove
```javascript
// 删除集合user下id为abc的文档
tcb database remove --colleciton user --doc abc

tcb database remove --colleciton user --data ./data.json
// data.json
{
    "doc": "abc"
}

tcb database remove --colleciton user --data ./data.js
// data.json
module.exports = {
    "doc": "abc"
}

// 批量删除集合user下id分别为 abc、123、abc123的文档
tcb database remove --colleciton user --data ./data.json
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

tcb database remove --colleciton user --data ./data.js
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
]
```
更新文档 update
```javascript
// 更新集合user下id为abc的文档数据

// 命令行参数指定文档，更新的数据为文件内容
tcb database update --colleciton user --doc abc --data ./user.json
// user.json
{
    "name": "eno",
    "sex": "male"
}

tcb database update --colleciton user --doc abc --data ./user.js
// user.js
module.exports = {
    name: 'eno',
    sex: 'male'
}

// 文件内容中指定文档 doc，更新数据为set对象
tcb database update --colleciton user --data ./user.json
// user.json
{
    "doc": "abc",
    "set": {
        "name": "eno",
        "sex": "male"
    }
}

tcb database update --colleciton user --data ./user.js
// user.js
module.exports = {
    doc: 'abc',
    set: {
        name: 'eno',
        sex: 'male'
    }
} 

// 批量更新集合user下id分别为 abc、123、abc123的文档，更新数据为set对象
tcb database update --colleciton user --data ./data.json
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

tcb database update --colleciton user --data ./data.js
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
]
```
创建或更新文档 set
```javascript
// set命令与以上update命令用法相同，区别仅在于当set可以不指定文档
// 当集合user不存在文档时，以下命令效果等同于add
// 当集合user存在文档时，以下命令将更新集合user中第一个文档
tcb database set --colleciton user --data ./user.json
// user.json
{
    "name": "eno",
    "sex": "male"
}
```