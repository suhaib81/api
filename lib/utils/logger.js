const split = require('split');

module.exports = {
  info(x) {
    console.log(x);
  },
  trace(x) {
    console.log(x);
  },
  error(x) {
    console.log(x);
  },
  db(x) {
    console.log('Message from database:', x);
  },
  stream: split().on('data', function(line) {
    console.log(line);
  })
}
