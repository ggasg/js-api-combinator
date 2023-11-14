const logger = require('pino')();
require('dotenv').config({debug: true });
const sendHttpsRequest = require('../utils/netUtils');

const gitUsers = async function () {
}

const retrieveGitUser = async function (objUser) {
    // Lesson: It's better to put together request options outside of the general function
    const options = {
        headers: {'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'gg-personal-api'},
        hostname: 'api.github.com',
        port: 443,
        path: `/users/${objUser.username}`,
        method: 'GET',
    };
    return await sendHttpsRequest(options);
}

module.exports = {gitUsers, retrieveGitUser};