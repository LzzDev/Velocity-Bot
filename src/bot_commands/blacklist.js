const blacklists = require('../../lib/modules/blacklists.js');

module.exports.run = async (bot, message, args, config, emitter) => {
  let AUTHOR_ID = message.author.id;

  let type = args[0];
  if(!type) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a blacklist type, either** \`server\` **or** \`user\`');

  let id = args[1];
  if(!id) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a server/user ID to blacklist**');

  let params = args.slice(2).join(' ');
  if(!params) params = null;

  if(type == 'user') {
    if(params && params.includes('--force')) {
      let addUserBlacklist = await blacklists.addUserBlacklist(bot, id, AUTHOR_ID);
      if(addUserBlacklist.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+addUserBlacklist.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'addUserBlacklist returned error: '+addUserBlacklist.error['stack']);
      };

      return message.channel.send(config.emotes['velocityTick'] + ' **- User ID** \`'+id+'\` **has been force blacklisted**');
    } else {
      let user = bot.users.cache.get(id);
      if(!user) return message.channel.send(config.emotes['velocityCross'] + ' **- User ID** \`'+id+'\` **not found, to force this blacklist use the** \`--force\` **parameter**');

      let USER_ID = user.id;
      let USER_TAG = user.tag;
      let addUserBlacklist = await blacklists.addUserBlacklist(bot, USER_ID, AUTHOR_ID);
      if(addUserBlacklist.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+addUserBlacklist.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'addUserBlacklist returned error: '+addUserBlacklist.error['stack']);
      };

      return message.channel.send(config.emotes['velocityTick'] + ' **- User** \`'+USER_TAG+' ('+USER_ID+')\` **has been blacklisted**');
    };
  } else if(type == 'server') {
    if(params && params.includes('--force')) {
      let addServerBlacklist = await blacklists.addServerBlacklist(bot, id, AUTHOR_ID);
      if(addServerBlacklist.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+addServerBlacklist.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'addServerBlacklist returned error: '+addServerBlacklist.error['stack']);
      };

      return message.channel.send(config.emotes['velocityTick'] + ' **- Server ID** \`'+id+'\` **has been force blacklisted**');
    } else {
      let server = bot.guilds.cache.get(id);
      if(!server) return message.channel.send(config.emotes['velocityCross'] + ' **- Server ID** \`'+id+'\` **not found, to force this blacklist use the** \`--force\` **parameter**');

      let SERVER_ID = server.id;
      let SERVER_NAME = server.name;
      let addServerBlacklist = await blacklists.addServerBlacklist(bot, SERVER_ID, AUTHOR_ID);
      if(addServerBlacklist.hasOwnProperty('error')) {
        message.channel.send('⚠️```'+addServerBlacklist.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'addServerBlacklist returned error: '+addServerBlacklist.error['stack']);
      };

      return message.channel.send(config.emotes['velocityTick'] + ' **- Server** \`'+SERVER_NAME+' ('+SERVER_ID+')\` **has been blacklisted**');
    };
  } else {
    return message.channel.send(config.emotes['velocityCross'] + ' **- The blacklist type needs to be** \`user\` **or** \`server\`');
  };

};

module.exports.config = {
	name: 'blacklist',
	usage() {
		return this.name + ' [server/user] [id] <parameter>';
  },
  usage() {
    return [
      this.name+' [server] [id] <parameter>',
      this.name+' [user] [id] <parameter>',
    ]
  },
  examples() {
    return [
      this.name+' server 1234567890',
      this.name+' server 1234567890 --force',
      this.name+' user 1234567890',
      this.name+' user 1234567890 --force'
    ]
  },
  description: 'Blacklist a user/server from using Velocity bot',
	aliases: [],
	permission: 4,
  isPremiumCommand: false,
  commandCategory: 'developer'
};