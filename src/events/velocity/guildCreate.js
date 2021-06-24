const moment = require('moment');

module.exports = function(emitter, bot, config) {
  bot.on('guildCreate', (guild) => {
    console.log('New guild, \'' + guild.name +' (' + guild.id + ')\' with ' + guild.memberCount + ' members' );

    bot.user.setActivity(config.bot['BOT_PREFIX']+'help | '+bot.guilds.cache.size+' servers');
  });
};

module.exports.config = {
  disabled: false
};