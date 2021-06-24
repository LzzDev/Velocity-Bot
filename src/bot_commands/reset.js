module.exports.run = async (bot, message, args, config, emitter) => {
  let GUILD_ID = message.guild.id;
  let member = message.guild.members.cache.get(args[0]) || message.guild.member(message.mentions.users.first());
  if(!member) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a user to reset the XP of**');

  if(member == message.author) {
    member.user = message.author;
  };

  if(member.user.bot) return message.channel.send(config.emotes['velocityCross'] + ' **- The user you have provided is a bot, bot\'s xp cannot be reset**');

  let resetXP = await bot.db.USER_XP.destroy({ where: { id: member.id, SERVER_ID: GUILD_ID } });
  if(!resetXP) {
    message.channel.send('⚠️```Error resetting XP for user ID '+member.id+' on server ID '+GUILD_ID+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'resetXP returned error');
  };

  message.channel.send(config.emotes['velocityTick'] + ' **- Reset all XP of user \`'+member.user.tag+' ('+member.user.id+')\`**');

};

module.exports.config = {
	name: 'reset',
	usage() {
    return [
      this.name+' [user]',
    ]
  },
  examples() {
    return [
      this.name+' @someUser',
    ]
  },
  description: 'Reset a users XP',
	aliases: [
		'resetxp'
	],
	permission: 3,
	isPremiumCommand: false,
	commandCategory: 'management'
};