const logger = require('pino')();
const sendHttpsRequest = require('../utils/netUtils');

// Lesson: Although this is a promise chain, the top level is still asynchronous. Without awaiting
// for this function to complete, its caller will submit the execution immediately
const getUsers = async function () {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'jsonplaceholder.typicode.com',
            port: 443,
            path: '/users',
            method: 'GET',
        };
        logger.debug(`Calling for api users ${options}`);
        sendHttpsRequest(options)
        .then((data) => {
            // writeResults(data, '/users.json');
            resolve(data);
        })
        .catch((err) => reject(err));  
    });
}

module.exports = getUsers;