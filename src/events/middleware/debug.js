const moment = require('moment');

module.exports = function(emitter, bot, config) {
  bot.on('debug', info => {
    console.log('Debug: ' + info);
  });
};

module.exports.config = {
  disabled: true
}