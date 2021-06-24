const moment = require('moment');

module.exports = function(emitter, bot, config) {
  emitter.on('log', log => {
    console.log( log );
  });
};

module.exports.config = {
  disabled: false
}