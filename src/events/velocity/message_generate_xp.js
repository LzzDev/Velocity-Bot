const blacklists = require('../../../lib/modules/blacklists.js');
const premium = require('../../../lib/modules/premium.js');
const configs = require('../../../lib/modules/configs.js');
const levels = require('../../../lib/modules/levels.js');

module.exports = function(emitter, bot, config) {
  bot.on('message', async message => {
    console.log( 'xp' )
    if(message.author.bot == true) return;
    if(message.channel.type == 'dm') return;
  
    let GUILD_ID = message.guild.id;
    let GUILD_NAME = message.guild.name;
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

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if(levels.isCommand(bot, command)) return;

    if(bot.xp_cooldown.has(GUILD_ID+'-'+AUTHOR_ID)) {
      return;
    } else {
      bot.xp_cooldown.add(GUILD_ID+'-'+AUTHOR_ID);
    };

    let generatedXP = levels.genXP(15, 25);

    let getUser = await levels.getUser(bot, GUILD_ID, AUTHOR_ID);
    if(getUser.hasOwnProperty('error')) {
      message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
      return emitter.emit('log', 'getUser returned error: '+getUser.error['stack']);
    };

    let TOTAL_XP_EARNED = getUser.TOTAL_XP_EARNED;
    if(!TOTAL_XP_EARNED) TOTAL_XP_EARNED = 0;

    let LEVEL_XP = getUser.LEVEL_XP;
    if(!LEVEL_XP) LEVEL_XP = 0;

    let LEVEL = getUser.LEVEL;
    if(!LEVEL) LEVEL = 0;

    let TOTAL_XP_EARNED_UPDATED = parseInt(TOTAL_XP_EARNED) + parseInt(generatedXP);
    let LEVEL_XP_UPDATED = parseInt(LEVEL_XP) + parseInt(generatedXP);

    let levelXP = levels.getLevelXP(LEVEL);
    if(!levelXP || isNaN(levelXP)) levelXP = 0;

    if(LEVEL_XP_UPDATED > levelXP) {
      console.log( 'level up' )
      let overBy = parseInt(LEVEL_XP_UPDATED) - parseInt(levelXP);
      if(!overBy || isNaN(overBy)) overBy = 0;

      let updateUserLevelUp = await bot.db.USER_XP.update({
        TOTAL_XP_EARNED: TOTAL_XP_EARNED_UPDATED,
        LEVEL_XP: overBy,
        LEVEL: parseInt(LEVEL) + 1
      }, { where: { id: AUTHOR_ID, SERVER_ID: GUILD_ID } });
      console.log( 'level up - 2' )

      if(!updateUserLevelUp) {
        message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
        return emitter.emit('log', 'Updating user ID '+AUTHOR_ID+' level returned error');
      };
      console.log( 'level up - 3' )

      let serverRewards = await bot.db.SERVER_REWARD_ROLES.findAll({ where: { id: GUILD_ID } });

      let rolesToGive = [];
      for (let i = 0; i < serverRewards.length; i++) {
        let ROLE_ID = serverRewards[i].ROLE_ID;
        if(!ROLE_ID) {
          console.log('[Velocity - '.error+moment(new Date()).format('DD/MM/YYYY h:mm:ss A').error+'] Skipping reward on level '.error+serverRewards[i].AWARD_AT_LEVEL.error+' for role ID '.error+serverRewards[i].ROLE_ID.error+' on server ID '.error+serverRewards[i].id.error);
          continue;
        };

        let AWARD_AT_LEVEL = serverRewards[i].AWARD_AT_LEVEL;
        if(!AWARD_AT_LEVEL) {
          console.log('[Velocity - '.error+moment(new Date()).format('DD/MM/YYYY h:mm:ss A').error+'] Skipping reward on level '.error+serverRewards[i].AWARD_AT_LEVEL.error+' for role ID '.error+serverRewards[i].ROLE_ID.error+' on server ID '.error+serverRewards[i].id.error);
          continue;
        };

        let role = message.guild.roles.cache.find(r => r.id == ROLE_ID);
        if(!role) continue;

        if(AWARD_AT_LEVEL > parseInt(LEVEL) + 1) continue;

        let hasRole = message.member.roles.cache.find(r => r.id == ROLE_ID);
        if(hasRole) continue;

        rolesToGive.push(role);

      };

      console.log( 'rolesToGive', rolesToGive )

      await message.member.roles.add(rolesToGive).catch( e => console.log( 'Error adding level up roles to member', message.member.tag, message.member.id, 'Error: ', e.message ) );

      let LEVEL_UP_MESSAGE_ENABLED = serverConfig.LEVEL_UP_MESSAGE_ENABLED;
      if(!LEVEL_UP_MESSAGE_ENABLED || LEVEL_UP_MESSAGE_ENABLED == 'off') return;

      let LEVEL_UP_MESSAGE_TYPE = serverConfig.LEVEL_UP_MESSAGE_TYPE;
      if(!LEVEL_UP_MESSAGE_TYPE) LEVEL_UP_MESSAGE_TYPE = 'channel';

      let LEVEL_UP_MESSAGE = serverConfig.LEVEL_UP_MESSAGE;
      if(!LEVEL_UP_MESSAGE) LEVEL_UP_MESSAGE = config.bot['LEVEL_MESSAGE'];
      LEVEL_UP_MESSAGE = LEVEL_UP_MESSAGE
      .replace('{user}', message.author)
      .replace('{level}', parseInt(LEVEL) + 1)
      .replace('{server}', GUILD_NAME);
  
      if(LEVEL_UP_MESSAGE_TYPE.toLowerCase() == 'channel') {
        return message.channel.send(LEVEL_UP_MESSAGE);
      } else if(LEVEL_UP_MESSAGE_TYPE.toLowerCase() == 'dm') {
        return message.author.send(LEVEL_UP_MESSAGE);
      };

    } else {
      console.log( 'update' )
      let updateUser = await bot.db.USER_XP.update({
        TOTAL_XP_EARNED: TOTAL_XP_EARNED_UPDATED,
        LEVEL_XP: LEVEL_XP_UPDATED,
      }, { where: { id: AUTHOR_ID, SERVER_ID: GUILD_ID } });

      if(!updateUser) {
        message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
        return emitter.emit('log', 'Updating user ID '+AUTHOR_ID+' xp returned error');
      };
    };

  });
};

module.exports.config = {
  disabled: false
};