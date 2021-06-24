const premium = require('../../lib/modules/premium.js');
const configs = require('../../lib/modules/configs.js');
const leaderboards = require('../../lib/modules/leaderboards.js');

module.exports.run = async (bot, message, args, config, emitter) => {
  let GUILD_ID = message.guild.id;

  let isPremium = await premium.isPremium(bot, GUILD_ID);
  if (isPremium.hasOwnProperty('error')) {
    message.channel.send('⚠️```' + isPremium.error['message'] + '```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'isPremium returned error: ' + isPremium.error['stack']);
  };

  let serverConfig = await configs.getConfig(bot, GUILD_ID);
  if(serverConfig.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+serverConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'getConfig returned error: '+serverConfig.error['stack']);
  };

  let customPrefix = serverConfig.PREFIX;

  let prefix = config.bot['BOT_PREFIX'];
  if(serverConfig && customPrefix && isPremium) prefix = customPrefix;

  let usage = '\n**Usage:**\n`';
  usage += this.config.usage()
    .map( u => prefix + u )
    .join( '\n' ) + '`'

  let type = args[0];
  if (!type) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a type, either** \`set\`**,** \`view\` **or** \`remove\`**.** '+usage);

  if(type.toLowerCase() == 'set') {
    let leaderboardChannel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();
    if(!leaderboardChannel) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a valid new channel to set.**'+usage);
    leaderboardChannel = leaderboardChannel.id;

    let setChannel = await leaderboards.setChannel(bot, GUILD_ID, leaderboardChannel)
    if(setChannel.hasOwnProperty('error')) {
      message.channel.send('⚠️```'+setChannel.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'setChannel returned error: '+setChannel.error['stack']);
    };

    let channel = message.guild.channels.cache.find(c => c.id == setChannel.STATIC_LEADERBOARD_CHANNEL);
    if(channel) {
      message.channel.send(config.emotes['velocityTick'] + ' **- The static leaderboard has been set to** \`'+channel.name+' ('+channel.id+')\`');
    } else {
      message.channel.send(config.emotes['velocityTick'] + ' **- The static leaderboard was set to an invalid channel, please re-setup a static leaderboard again**');
    };
  } else if(type.toLowerCase() == 'view') {
    let getLeaderboard = await leaderboards.getLeaderboard(bot, GUILD_ID);
    if(getLeaderboard.hasOwnProperty('error')) {
      message.channel.send('⚠️```'+getLeaderboard.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'getLeaderboard returned error: '+getLeaderboard.error['stack']);
    };
    if(!getLeaderboard.STATIC_LEADERBOARD_CHANNEL) {
      return message.channel.send(config.emotes['velocityCross'] + ' **- There is currently no static leaderboard set**');
    };

    let channel = message.guild.channels.cache.find(c => c.id == getLeaderboard.STATIC_LEADERBOARD_CHANNEL);
    if(channel) {
      message.channel.send(config.emotes['velocityTick'] + ' **- The static leaderboard is currently set to** \`'+channel.name+' ('+channel.id+')\`');
    } else {
      message.channel.send(config.emotes['velocityTick'] + ' **- The static leaderboard is currently set to an invalid channel, please re-setup a static leaderboard again**');
    };
  } else if(type.toLowerCase() == 'remove') {
    let getLeaderboard = await leaderboards.getLeaderboard(bot, GUILD_ID);
    if(getLeaderboard.hasOwnProperty('error')) {
      message.channel.send('⚠️```'+getLeaderboard.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'getLeaderboard returned error: '+getLeaderboard.error['stack']);
    };
    if(!getLeaderboard.STATIC_LEADERBOARD_CHANNEL) {
      return message.channel.send(config.emotes['velocityCross'] + ' **- There is currently no static leaderboard set**');
    };

    let deleteLB = await bot.db.SERVER_STATIC_LEADERBOARD.destroy({ where: { id: GUILD_ID } });
    if(!deleteLB) {
      message.channel.send('⚠️```Error deleteing static leaderboard for server ID '+GUILD_ID+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'deleteLB returned error');
    };

    message.channel.send(config.emotes['velocityTick'] + ' **- The static leaderboard has been deleted for this server**');
  } else {
    return message.channel.send(config.emotes['velocityCross'] + ' **- The reward type needs to be** \`set\`**,** \`view\` **or** \`remove\`**.** '+usage);
  };
};

module.exports.config = {
	name: 'staticleaderboard',
	usage() {
    return [
      this.name+' [set] [channel]',
      this.name+' [view]',
      this.name+' [remove]'
    ]
  },
  examples() {
    return [
      this.name+' set #myCoolChannel',
      this.name+' view',
      this.name+' remove'
    ]
  },
  description: 'Change/Display the servers static leaderboard settings (a leaderboard which is auto-updated every 10 messages)',
	aliases: [
    'staticlb'
  ],
	permission: 2,
  isPremiumCommand: true,
  commandCategory: 'management'
};