
let Q_MPAPPID = {
    type: 'input',
    name: 'mpappid',
    message: 'Please input your miniprogram appid:'
};

let Q_ENV = {
    type: 'input',
    name: 'env',
    message: 'Please input your environment id:'
};

let Q_SECRETID = {
    type: 'input',
    name: 'secretid',
    message: 'Please input your tencent cloud secret id:'
};

let Q_SECRETKEY = {
    type: 'input',
    name: 'secretkey',
    message: 'Please input your tencent cloud secret key:'
};

let Q_PROJECT = {
    type: 'input',
    name: 'project',
    message: 'project name:'
};

module.exports = {
    Q_MPAPPID,
    Q_ENV,
    Q_SECRETID,
    Q_SECRETKEY,
    Q_PROJECT
};