const logger = require('pino')();

const apiUsers = require('../ext-api/api-users');
const {retrieveGitUser} = require('../ext-api/api-git');

const fs = require('node:fs');
const path = require('node:path');

function readFromFile() {
    return fs.readFileSync(path.join(__dirname, '../../api_users.json'), { encoding: 'utf8' });
}

const mergeUsers = async function () {
    try {
        const apiUsersData = await apiUsers();
        
        fs.writeFileSync(path.join(__dirname, '../../api_users.json'), apiUsersData, { });
        
        const result = JSON.parse(readFromFile());
        let operations = [];
        for (curr of result) {
            const {id, username} = curr;
            operations.push(retrieveGitUser({id, username}));
        }
        
        let writeStream = fs.createWriteStream(path.join(__dirname, '../../git-results.json'), {encoding: 'utf-8'});
        writeStream.write('[');
        Promise.allSettled(operations)
        .then((values) => {
            for (const i in values) {
                if (values[i].status === 'fulfilled') {
                    writeStream.write(values[i].value);
                    if (Number(i) + 1 < values.length - 1) {
                        writeStream.write(',\n');
                    }
                }
            }
            writeStream.end(']');
        })
        .catch((err) => console.error);
    }
    catch (err) {
        logger.fatal(err.message);
    }
    logger.debug('Merge done');
    return;
}

module.exports = mergeUsers;