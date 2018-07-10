
const ERR_MSG = {
    mpappid: 'Please input miniprogram appid.',
    project: 'Please input project name.',
    env: 'Please input environment id.',
    secretid: 'Please input secretid.',
    secretkey: 'Please input secretkey.'
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
            this.error(ERR_MSG[key]);
            return true;
        }
    }
};