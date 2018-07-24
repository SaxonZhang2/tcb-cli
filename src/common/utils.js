const {
    MAPPID_MISSING,
    PROJECT_MISSING,
    ENVID_MISSING,
    SECRETID_MISSING,
    SECRETKEY_MISSING
} = require('./message');

const ERR_MSG = {
    mpappid: MAPPID_MISSING,
    project: PROJECT_MISSING,
    env: ENVID_MISSING,
    secretid: SECRETID_MISSING,
    secretkey: SECRETKEY_MISSING
};

/**
 * check question answers
 * @param {Object} answers
 * @param {Array} checkFields
 */
exports.checkInput = (answers, checkFields = []) => {
    for (let i = 0, len = checkFields.length; i < len; i++) {
        let key = checkFields[i];
        if (!answers[key]) {
            return ERR_MSG[key];
        }
    }
};