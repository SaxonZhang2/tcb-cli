
let Q_MPAPPID = {
    type: 'input',
    name: 'mpappid',
    message: '输入小程序 appid:'
};

let Q_ENV = {
    type: 'input',
    name: 'env',
    message: '输入小程序云 env id:'
};

let Q_SECRETID = {
    type: 'input',
    name: 'secretid',
    message: '输入腾讯云 secret id:'
};

let Q_SECRETKEY = {
    type: 'input',
    name: 'secretkey',
    message: '输入腾讯云 secret key:'
};

let Q_PROJECT = {
    type: 'input',
    name: 'project',
    message: '项目名称:'
};

module.exports = {
    Q_MPAPPID,
    Q_ENV,
    Q_SECRETID,
    Q_SECRETKEY,
    Q_PROJECT
};