const premium = require('../../lib/modules/premium.js');
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

  let usage = '\n**Usage:**\n`.'+
  this['config'].usage().join('`\n`'+prefix)+
  '`';

  let type = args[0];
  if (!type) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a type, either** \`type\`**,** \`toggle\`**,** \`set\` **or** \`view\`**.** '+usage);

  if (type.toLowerCase() == 'type') {
    let messageType = args[1];
    if(!messageType) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a level message type, either** \`dm\` **or** \`channel\`**.** '+usage);

    if(messageType.toLowerCase() == 'dm') {
      let getConfig = await configs.getConfig(bot, GUILD_ID);
      if(getConfig.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+getConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'getConfig returned error: '+getConfig.error['stack']);
      };
      if(getConfig && getConfig.LEVEL_UP_MESSAGE_TYPE && getConfig.LEVEL_UP_MESSAGE_TYPE.toLowerCase() == 'dm') {
        return message.channel.send(config.emotes['velocityCross'] + ' **- The level message type is already set to** \`dm\`');
      };

      let setMessageType = await configs.setMessageType(bot, GUILD_ID, messageType.toLowerCase());
      if(setMessageType.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+setMessageType.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'setMessageType returned error: '+setMessageType.error['stack']);
      };

      message.channel.send(config.emotes['velocityTick'] + ' **- The level message type has been set to** \`dm\`');
    } else if(messageType.toLowerCase() == 'channel') {
      let getConfig = await configs.getConfig(bot, GUILD_ID);
      if(getConfig.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+getConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'getConfig returned error: '+getConfig.error['stack']);
      };
      if(getConfig && getConfig.LEVEL_UP_MESSAGE_TYPE && getConfig.LEVEL_UP_MESSAGE_TYPE.toLowerCase() == 'channel') {
        return message.channel.send(config.emotes['velocityCross'] + ' **- The level message type is already set to** \`channel\`');
      };

      let setMessageType = await configs.setMessageType(bot, GUILD_ID, messageType.toLowerCase());
      if(setMessageType.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+setMessageType.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'setMessageType returned error: '+setMessageType.error['stack']);
      };

      message.channel.send(config.emotes['velocityTick'] + ' **- The level message type has been set to** \`channel\`');
    } else {
      return message.channel.send(config.emotes['velocityCross'] + ' **- The message type needs to be** \`dm\` **or** \`channel\`**.** '+usage);
    };
  } else if (type.toLowerCase() == 'toggle') {
    let toggleType = args[1];
    if(!toggleType) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a toggle message type, either** \`on\` **or** \`off\`**.** '+usage);

    if(toggleType.toLowerCase() == 'on') {
      let getConfig = await configs.getConfig(bot, GUILD_ID);
      if(getConfig.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+getConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'getConfig returned error: '+getConfig.error['stack']);
      };
      if(getConfig && getConfig.LEVEL_UP_MESSAGE_ENABLED && getConfig.LEVEL_UP_MESSAGE_ENABLED.toLowerCase() == 'on') {
        return message.channel.send(config.emotes['velocityCross'] + ' **- The toggle message type is already set to** \`on\`');
      };

      let setMessageToggled = await configs.setMessageToggled(bot, GUILD_ID, toggleType.toLowerCase())
      if(setMessageToggled.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+setMessageToggled.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'setMessageToggled returned error: '+setMessageToggled.error['stack']);
      };

      message.channel.send(config.emotes['velocityTick'] + ' **- The toggle message type has been set to** \`on\`');
    } else if(toggleType.toLowerCase() == 'off') {
      let getConfig = await configs.getConfig(bot, GUILD_ID);
      if(getConfig.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+getConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'getConfig returned error: '+getConfig.error['stack']);
      };
      if(getConfig && getConfig.LEVEL_UP_MESSAGE_ENABLED && getConfig.LEVEL_UP_MESSAGE_ENABLED.toLowerCase() == 'off') {
        return message.channel.send(config.emotes['velocityCross'] + ' **- The toggle message type is already set to** \`off\`');
      };

      let setMessageToggled = await configs.setMessageToggled(bot, GUILD_ID, toggleType.toLowerCase())
      if(setMessageToggled.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+setMessageToggled.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'setMessageToggled returned error: '+setMessageToggled.error['stack']);
      };

      message.channel.send(config.emotes['velocityTick'] + ' **- The toggle message type has been set to** \`off\`');
    } else {
      return message.channel.send(config.emotes['velocityCross'] + ' **- The toggle type needs to be** \`on\` **or** \`off\`**.** '+usage);
    };

  } else if(type.toLowerCase() == 'set') {
    let levelMessage = args.slice(1).join(' ');
    if(!levelMessage) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a new level message to set.\nYou can use the following variables in your level message:** \`{user}\`, \`{level}\`, \`{server}\`**.** '+usage);

    let setMessage = await configs.setMessage(bot, GUILD_ID, levelMessage);
    if(setMessage.hasOwnProperty('error')) {
      message.channel.send('⚠️```'+setMessage.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'setMessage returned error: '+setMessage.error['stack']);
    };

    message.channel.send(config.emotes['velocityTick'] + ' **- The level message has been set to:**```\n'+setMessage.LEVEL_UP_MESSAGE+'\n```');
  } else if(type.toLowerCase() == 'view') {
    let getConfig = await configs.getConfig(bot, GUILD_ID);
    if(getConfig.hasOwnProperty('error')) {
      message.channel.send('⚠️```'+getConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'getConfig returned error: '+getConfig.error['stack']);
    };
    if(!getConfig.LEVEL_UP_MESSAGE) {
      return message.channel.send(config.emotes['velocityCross'] + ' **- There is currently no level message set**');
    };

    message.channel.send(config.emotes['velocityTick'] + ' **- The level message is currently set to:**```\n'+getConfig.LEVEL_UP_MESSAGE+'\n```');
  } else {
    return message.channel.send(config.emotes['velocityCross'] + ' **- The reward type needs to be** \`type\`**,** \`toggle\`**,** \`set\` **or** \`view\`**.** '+usage);
  };
};

module.exports.config = {
  name: 'message',
  usage() {
    return [
      this.name+' [type] [dm | channel]',
      this.name+' [toggle] [on | off]',
      this.name+' [set] [message]',
      this.name+' [view]',
    ]
  },
  examples() {
    return [
      this.name+' type dm',
      this.name+' type channel',
      this.name+' toggle on',
      this.name+' toggle off',
      this.name+' set {user} has reached level {level}!',
      this.name+' view'
    ]
  },
  description: 'Set the level up message for the server',
  aliases: [
    'levelmessage',
  ],
  permission: 2,
  isPremiumCommand: false,
  commandCategory: 'management'
};