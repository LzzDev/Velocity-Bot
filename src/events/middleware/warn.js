const moment = require('moment');

module.exports = function(emitter, bot, config) {
  bot.on('warn', info => {
    console.log('Warn: ' + info);
  });
};

module.exports.config = {
  disabled: false
}