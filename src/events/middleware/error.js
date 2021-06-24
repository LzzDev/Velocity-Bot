const moment = require('moment');

module.exports = function(emitter, bot, config) {
  bot.on('error', err => {
    console.log('Velocity has encountered an error: ' + err.message);
  });
};

module.exports.config = {
  disabled: false
}