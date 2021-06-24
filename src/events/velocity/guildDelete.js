const moment = require('moment');

module.exports = function(emitter, bot, config) {
  bot.on('guildDelete', (guild) => {
    console.log('Removed from guild, \'' + guild.name + ' (' + guild.id + ')\' with ' + guild.memberCount + ' members');

    bot.user.setActivity(config.bot['BOT_PREFIX']+'help | '+bot.guilds.cache.size+' servers');
  });
};

module.exports.config = {
  disabled: false
};