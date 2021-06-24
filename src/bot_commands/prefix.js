const premium = require('../../lib/modules/premium.js');
const configs = require('../../lib/modules/configs.js');

module.exports.run = async (bot, message, args, config, emitter) => {
  let GUILD_ID = message.guild.id;
  let AUTHOR_ID = message.author.id;

  let isPremium = await premium.isPremium(bot, GUILD_ID);
  if(isPremium.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+isPremium.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'isPremium returned error: '+isPremium.error['stack']);
  };

  let serverConfig = await configs.getConfig(bot, GUILD_ID);
  if(serverConfig.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+serverConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'getConfig returned error: '+serverConfig.error['stack']);
  };

  let customPrefix = serverConfig.PREFIX;

  let prefix = config.bot['BOT_PREFIX'];
  if(serverConfig && customPrefix && isPremium) prefix = customPrefix;

  let newPrefix = args[0];
  if(!newPrefix) return message.channel.send(config.emotes['velocityTick'] + ' **- My prefix here is** \`'+prefix+'\`**, to change my prefix use \`'+prefix+this['config'].usage()+'\`**');

  if(newPrefix.length > 3) return message.channel.send(config.emotes['velocityCross'] + ' **- The prefix must be no more than 3 chacaters long**');

  let setPrefix = await configs.setPrefix(bot, GUILD_ID, newPrefix);
  if(setPrefix.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+setPrefix.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'setPrefix returned error: '+setPrefix.error['stack']);
  };

  let updatedConfig = await configs.getConfig(bot, GUILD_ID);
  if(updatedConfig.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+updatedConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'getConfig returned error: '+updatedConfig.error['stack']);
  };

  message.channel.send(config.emotes['velocityTick'] + ' **- My prefix has been updated to** \`'+updatedConfig.PREFIX+'\`')

};

module.exports.config = {
	name: 'prefix',
	usage() {
    return [
      this.name+' [prefix]',
    ]
  },
  examples() {
    return [
      this.name,
      this.name+' -'
    ]
  },
  description: 'Change/Display the servers prefix',
	aliases: [
    'setprefix'
  ],
	permission: 2,
  isPremiumCommand: true,
  commandCategory: 'management'
};