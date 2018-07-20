module.exports = {
    "env": {},
    "extends": [
        "eslint-config-alloy"
    ],
    "plugins": [],
    "rules": {
        complexity: ["error", 20]
    },
    "globals": {
        "describe": true,
        "it": true,
        "before": true,
        "after": true,
        "beforeAll": true,
        "afterAll": true,
        "beforeEach": true,
        "afterEach": true,
        "mockFn": true,
        "jest": true,
        "expect": true ,
        "test": true
    }
};