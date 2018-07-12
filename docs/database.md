## 数据库 database

添加单个数据
```javascript
tcb database:add --colleciton user --data ./user.json
// user.json
{
    name: 'enofan',
    sex: 'male'
}

//添加批量数据
tcb database:add --colleciton user --data ./user.json
// user.json 
[
    {
        name: 'enofan',
        sex: 'male'
    },
    {
        name: 'justan',
        sex: 'male'
    }
]

// 添加批量数据
tcb database:add --colleciton user --data ./user.js
// user.js
module.exports = [
    {
        name: 'enofan',
        sex: () => {
            return 'male';
        }
    },
    {
        name: 'justan',
        sex: 'male'
    }
];

// 更新数据
tcb database:set --colleciton user --data ./user.json
// user.json
{
    doc: 'id123',
    set: {
        name: 'jimmy'
    }
}

// 删除数据
tcb database:remove --colleciton user --data ./user.json
// user.json
{
    doc: 'id456'
}
```