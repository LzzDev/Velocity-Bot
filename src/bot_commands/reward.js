const premium = require('../../lib/modules/premium.js');
const rewards = require('../../lib/modules/rewards.js');
const configs = require('../../lib/modules/configs.js');

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

  let usage = '\n**Usage:**\n`'+
  prefix+this['config'].usage().join('`\n`'+prefix)+
  '`';

  let type = args[0];
  if (!type) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a type, either** \`add\` **or** \`remove\`**.** '+usage);

  if (type.toLowerCase() == 'add') {
    let level = Math.round(parseInt(args[1]));
    if (!level || isNaN(level)) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a level to add the reward to.** '+usage);
    if (!isPremium && level > 10) return message.channel.send(config.emotes['velocityCross'] + ' **- Only premium servers can have reward roles on levels higher than 10**');
    if(level < 1) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a level that is not smaller than 1**');

    let role = message.guild.roles.cache.get(args.slice(2).join(' ')) || message.mentions.roles.first();
    if (!role) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a valid role to add the reward to.** '+usage);

    let getRewardByRole = await rewards.getRewardByRole(bot, GUILD_ID, role.id);
    if(getRewardByRole) return message.channel.send(config.emotes['velocityCross'] + ' **- There is already a reward setup for that role (level: '+getRewardByRole.AWARD_AT_LEVEL+')**');

    let checkRewardByLevel = await rewards.getRewardByLevel(bot, GUILD_ID, level);
    if(checkRewardByLevel) return message.channel.send(config.emotes['velocityCross'] + ' **- There is already a reward setup for that level (role: '+(checkRewardByLevel.ROLE_ID && message.guild.roles.cache.get(checkRewardByLevel.ROLE_ID) ? '`'+message.guild.roles.cache.get(checkRewardByLevel.ROLE_ID).name+' ('+checkRewardByLevel.ROLE_ID+')`' : '`Invalid Role`')+')**');

    let addReward = await rewards.addReward(bot, GUILD_ID, role.id, level);
    if (addReward.hasOwnProperty('error')) {
      message.channel.send('⚠️```' + addReward.error['message'] + '```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'addReward returned error: ' + addReward.error['stack']);
    };

    message.channel.send(config.emotes['velocityTick'] + ' **- Added reward role \`'+role.name+' ('+role.id+')\` for level '+level+'**');

  } else if (type.toLowerCase() == 'remove') {
    let item = args[1];
    if(!item) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a role or level to remove the reward role of.** '+usage);
    
    let isLevel = (isNaN(parseInt(item)) ? false : true);
    let isRole = (item.includes('<') == true && item.includes('@') == true && item.includes('>') == true ? true : false);

    if(isLevel) {
      let getRewardByLevel = await rewards.getRewardByLevel(bot, GUILD_ID, item);
      if (getRewardByLevel.hasOwnProperty('error')) {
        message.channel.send('⚠️```' + getRewardByLevel.error['message'] + '```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'getRewardByLevel returned error: ' + getRewardByLevel.error['stack']);
      };

      if(!getRewardByLevel) return message.channel.send(config.emotes['velocityCross'] + ' **- No role reward found for level '+item+'**');

      let removeRewardByLevel = await rewards.removeRewardByLevel(bot, GUILD_ID, item);
      if (removeRewardByLevel.hasOwnProperty('error')) {
        message.channel.send('⚠️```' + removeRewardByLevel.error['message'] + '```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'removeRewardByLevel returned error: ' + removeRewardByLevel.error['stack']);
      };

      let role = message.guild.roles.cache.find(r => r.id == getRewardByLevel.ROLE_ID);
      if(role) {
        return message.channel.send(config.emotes['velocityTick'] + ' **- Removed reward role \`'+role.name+' ('+role.id+')\` for level '+item+'**');
      } else {
        return message.channel.send(config.emotes['velocityTick'] + ' **- Removed reward role for level '+item+'**');
      };

    } else if(isRole) {
      let role = message.guild.roles.cache.get(args.slice(1).join(' ')) || message.mentions.roles.first();
      if(!role) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a valid role to remove the reward role of.** '+usage);

      let ROLE_ID = role.id;

      let getRewardByRole = await rewards.getRewardByRole(bot, GUILD_ID, ROLE_ID);
      if (getRewardByRole.hasOwnProperty('error')) {
        message.channel.send('⚠️```' + getRewardByRole.error['message'] + '```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'getRewardByRole returned error: ' + getRewardByRole.error['stack']);
      };

      if(!getRewardByRole) return message.channel.send(config.emotes['velocityCross'] + ' **- No role reward found for role** \`'+role.name+' ('+ROLE_ID+')\`');

      let removeRewardByRole = await rewards.removeRewardByRole(bot, GUILD_ID, ROLE_ID);
      if (removeRewardByRole.hasOwnProperty('error')) {
        message.channel.send('⚠️```' + removeRewardByRole.error['message'] + '```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'removeRewardByRole returned error: ' + removeRewardByRole.error['stack']);
      };

      let roleReward = message.guild.roles.cache.find(r => r.id == getRewardByRole.ROLE_ID);
      if(roleReward) {
        return message.channel.send(config.emotes['velocityTick'] + ' **- Removed reward role \`'+roleReward.name+' ('+roleReward.id+')\` for level '+getRewardByRole.AWARD_AT_LEVEL+'**');
      } else {
        return message.channel.send(config.emotes['velocityTick'] + ' **- Removed reward role for level '+getRewardByRole.AWARD_AT_LEVEL+'**');
      };

    } else {
      return messge.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a valid role or level to remove the reward role of.** '+usage);
    };

  } else {
    return message.channel.send(config.emotes['velocityCross'] + ' **- The reward type needs to be** \`add\` **or** \`remove\`**.** '+usage);
  };

};

module.exports.config = {
  name: 'reward',
  usage() {
    return [
      this.name+' [add] [level] [role]',
      this.name+' [remove] [level | role]'
    ]
  },
  examples() {
    return [
      this.name+' add 10 @myCoolRole',
      this.name+' remove 23',
      this.name+' remove @myCoolRole'
    ]
  },
  description: 'Add or remove a reward role',
  aliases: [
    'rewardrole'
  ],
  permission: 2,
  isPremiumCommand: false,
  commandCategory: 'levelling'
};