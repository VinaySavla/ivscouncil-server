const time = require('../constants/time');

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const crons = [];
const DEFAULT_TIMEOUT = 1 * time.DAY;

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const cron = require(path.join(__dirname, file));
    crons.push(cron);
  });


async function runCron(cron) {
    let timeout = DEFAULT_TIMEOUT;
    try {
        timeout = await cron();
        if (typeof timeout !== 'number') timeout = DEFAULT_TIMEOUT;
    } catch (error) {
        console.log(error);
    }
    setTimeout(runCron, timeout, cron);
}

function runCrons() {
    for(const cron of crons) {
        runCron(cron);
    }
}

module.exports = runCrons;