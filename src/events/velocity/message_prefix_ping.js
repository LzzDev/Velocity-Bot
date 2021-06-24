const blacklists = require('../../../lib/modules/blacklists.js');
const premium = require('../../../lib/modules/premium.js');
const configs = require('../../../lib/modules/configs.js');

module.exports = function(emitter, bot, config) {
  bot.on('message', async message => {
    if(message.author.bot == true) return;
    if(message.channel.type == 'dm') return;
  
    let GUILD_ID = message.guild.id;
    let AUTHOR_ID = message.author.id;
  
    let isUserBlacklisted = await blacklists.isUserBlacklisted(bot, AUTHOR_ID);
    if(isUserBlacklisted.hasOwnProperty('error')) {
      message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
      return emitter.emit('log', 'isUserBlacklisted returned error: '+isUserBlacklisted.error['stack']);
    };
    if(isUserBlacklisted) return;
  
    let isServerBlacklisted = await blacklists.isServerBlacklisted(bot, GUILD_ID);
    if(isServerBlacklisted.hasOwnProperty('error')) {
      message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
      return emitter.emit('log', 'isServerBlacklisted returned error: '+isServerBlacklisted.error['stack']);
    };
    if(isServerBlacklisted) return;
  
    let isPremium = await premium.isPremium(bot, GUILD_ID);
    if(isPremium.hasOwnProperty('error')) {
      message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
      return emitter.emit('log', 'isPremium returned error: '+isPremium.error['stack']);
    };
  
    let serverConfig = await configs.getConfig(bot, GUILD_ID);
    if(serverConfig.hasOwnProperty('error')) {
      message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
      return emitter.emit('log', 'getConfig returned error: '+serverConfig.error['stack']);
    };
  
    let customPrefix = serverConfig.PREFIX;
  
    let prefix = config.bot['BOT_PREFIX'];
    if(serverConfig && customPrefix && isPremium) prefix = customPrefix;
  
    if(message.content.toString() == '<@!'+bot.user.id+'>') return message.channel.send(config.emotes['velocityTick'] + ' **- My prefix here is** \`'+prefix+'\`');
  });
};

module.exports.config = {
  disabled: false
};