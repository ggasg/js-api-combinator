const logger = require('pino')();
const https = require('node:https');

// Lesson: Although this is not an asynchronous function, https.request is event-based and thus it makes asynchronous operations
// Wrapping in a promise helps control the sequence of tasks
const sendHttpsRequest = function (options) {
    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
            logger.debug('statusCode:', res.statusCode);
            logger.debug('headers:', res.headers);
            res.setEncoding('utf-8');
            let body = '';
            
            if (res.statusCode === 404) {
                reject('No Results');
            }
            
            res.on('data', (data) => {
                body += data;
            });
            
            res.on('end', () => {
                resolve(body);
            })
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

module.exports = sendHttpsRequest;