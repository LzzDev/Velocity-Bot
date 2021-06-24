const axios = require('axios');

module.exports = function(emitter, bot, config) {
  bot.on('ready', () => {
    console.log( 'STARTING IN ' + process.env.NODE_ENV + ' MODE' );
    console.log(bot.user.tag + ' is online with ' + bot.guilds.cache.size + ' servers & ' + bot.users.cache.size + ' users');

    bot.user.setActivity(config.bot['BOT_PREFIX']+'help | '+bot.guilds.cache.size+' servers');


    if (process.env.NODE_ENV == 'production') {
      const postStatsURL = config.blist.base_url + '/api/v2/bot/' + (process.env.NODE_ENV == 'development' ? '514131162470285314' : bot.user.id) + '/stats/';
      const post = () => axios.patch(postStatsURL, {
          server_count: bot.guilds.cache.size,
          shard_count: 1
      }, {headers: {'Authorization': config.blist.token}})
          .then(() => console.log('[BList] Posted stats succesfully'))
          .catch(e => console.log('[BList] Error posting stats: ' + e.message));
  
      post();
  
      setInterval(() => {
          post();
      }, 3600000);
    };
  });
};

module.exports.config = {
  disabled: false
};