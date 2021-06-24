const blacklists = require('../../../lib/modules/blacklists.js');
const premium = require('../../../lib/modules/premium.js');
const configs = require('../../../lib/modules/configs.js');

module.exports = function(emitter, bot, config) {
  bot.on('message', async message => {
    if(message.author.bot == true) return;
    if(message.channel.type == 'dm') return;

    let GUILD_ID = message.guild.id;
    let AUTHOR_ID = message.author.id;

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

    if(!message.content.startsWith(prefix)) return;

    if(isPremium) {
      if(bot.command_cooldown_premium.has(GUILD_ID+'-'+AUTHOR_ID)) {
        return message.channel.send(config.emotes['velocityCross'] + ' **- You are in the command cooldown!**').then(msg => msg.delete({ timeout: 3000 }));
      };
    } else {
      if(bot.command_cooldown.has(GUILD_ID+'-'+AUTHOR_ID)) {
        return message.channel.send(config.emotes['velocityCross'] + ' **- You are in the command cooldown!**').then(msg => msg.delete({ timeout: 3000 }));
      };
    };

    const args = message.content.slice(prefix.length).split(' ');
    const commandArg = args.shift().toLowerCase();

    let command;
    if(bot.commands.has(commandArg)) {
      command = bot.commands.get(commandArg);
    } else if(bot.command_aliases.has(commandArg)) {
      command = bot.commands.get(bot.command_aliases.get(commandArg));
    };

    if(!command) return;
    if(command.config['isPremiumCommand'] && !isPremium) return message.channel.send(config.emotes['velocityCross'] + ' **- This command is only available to premium servers!**').then(msg => msg.delete(5000));

    let isUserBlacklisted = await blacklists.isUserBlacklisted(bot, AUTHOR_ID);
    if(isUserBlacklisted.hasOwnProperty('error')) {
      message.channel.send('⚠️```'+isUserBlacklisted.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'isUserBlacklisted returned error: '+isUserBlacklisted.error['stack']);
    };
    if(isUserBlacklisted) return;

    let isServerBlacklisted = await blacklists.isServerBlacklisted(bot, GUILD_ID);
    if(isServerBlacklisted.hasOwnProperty('error')) {
      message.channel.send('⚠️```'+isServerBlacklisted.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
      return emitter.emit('log', 'isServerBlacklisted returned error: '+isServerBlacklisted.error['stack']);
    };
    if(isServerBlacklisted) return;

    

    if(command.config['permission'] == 4) {
      // Bot dev
      if(!config.bot['DEVS'].includes(AUTHOR_ID)) return;
    } else if(command.config['permission'] == 3) {
      // Server owner
      if(message.guild.owner.user.id != AUTHOR_ID) return message.channel.send(config.emotes['velocityCross'] + ' **- No permission! This command is only for the use of the server owner**').then(msg => msg.delete(5000));
    } else if(command.config['permission'] == 2) {
      // Server admin - ADMINISTRATOR, MANAGE_GUILD, MANAGE_ROLES
      let isAdmin = false;
      if(message.member.hasPermission('ADMINISTRATOR')) isAdmin = true;
      if(message.member.hasPermission('MANAGE_GUILD')) isAdmin = true;
      if(message.member.hasPermission('MANAGE_ROLES')) isAdmin = true;

      if(!isAdmin) return message.channel.send(config.emotes['velocityCross'] + ' **- No permission! This command is only for the use of server admins**').then(msg => msg.delete(5000));
    } else if(command.config['permission'] == 1) {
      // Server mod - KICK_MEMBERS, BAN_MEMBERS, MANAGE_MESSAGES, ADMINISTRATOR, MANAGE_GUILD, MANAGE_ROLES
      let isMod = false;
      if(message.member.hasPermission('KICK_MEMBERS')) isMod = true;
      if(message.member.hasPermission('BAN_MEMBERS')) isMod = true;
      if(message.member.hasPermission('MANAGE_MESSAGES')) isMod = true;
      if(message.member.hasPermission('ADMINISTRATOR')) isMod = true;
      if(message.member.hasPermission('MANAGE_GUILD')) isMod = true;
      if(message.member.hasPermission('MANAGE_ROLES')) isMod = true;

      if(!isMod) return message.channel.send(config.emotes['velocityCross'] + ' **- No permission! This command is only for the use of server moderators**').then(msg => msg.delete(5000));
    };

    command.run(bot, message, args, config, emitter);

    if(isPremium) {
      if(!bot.command_cooldown_premium.has(GUILD_ID+'-'+AUTHOR_ID)) {
        bot.command_cooldown_premium.add(GUILD_ID+'-'+AUTHOR_ID);
      };
    } else {
      if(!bot.command_cooldown.has(GUILD_ID+'-'+AUTHOR_ID)) {
        bot.command_cooldown.add(GUILD_ID+'-'+AUTHOR_ID);
      };
    };

  });

};

module.exports.config = {
  disabled: false
};