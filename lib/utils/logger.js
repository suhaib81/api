const split = require('split');
const colors = require('colors');

const config = {
  info: { color: 'blue' },
  trace: { color: 'white', on: process.env.LOG_TRACE === 'true' },
  debug: { color: 'yellow', on: process.env.LOG_DEBUG === 'true' },
  error: { color: 'red' },
  dbTrace: { color: 'white', on: process.env.LOG_DB_TRACE === 'true' },
  dbWarn: { color: 'blue' },
  stream: { color: 'blue' }
};

function now() {
  let date = new Date();
  return date.toISOString();
}

module.exports = {
  info(x) {
    console.log('[INFO]    ' [config.info.color], `[${now()}] ${x}`);
  },
  trace(x) {
    if (!config.trace.on) {
      return;
    }
    console.log('[TRACE]   ' [config.trace.color], `[${now()}] ${x}`);
  },
  debug(x) {
    if (!config.debug.on) {
      return;
    }
    console.log('[TRACE]   ' [config.trace.color], `[${now()}] ${x}`);
  },
  error(x) {
    console.log('[ERROR]   ' [config.error.color], `[${now()}] ${x}`);
  },
  db(x) {
    if (!config.dbTrace.on) {
      return;
    }
    console.log('[TRACE-DB]' [config.dbTrace.color], `[${now()}] ${x}`);
  },
  dbWarn(x) {
    console.log('[ERROR-DB]' [config.error.color], `[${now()}] ${x}`);
  },
  stream: split().on('data', function(x) {
    console.log('[REQ]     ' [config.info.color], `[${now()}] ${x}`);
  })
}
