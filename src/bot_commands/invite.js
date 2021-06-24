const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');

module.exports.run = async (bot, message, args, config, emitter) => {
	let embed = new MessageEmbed()
	.setTitle('Invite Link')
	.setDescription('**You can invite Velocity bot by clicking [here]('+config.bot['INVITE_URL']+') or by visiting '+config.bot['INVITE_URL']+'**')
	.setColor(await premium.Colour(bot, message.guild.id));

	message.channel.send(embed);

};

module.exports.config = {
	name: 'invite',
	usage() {
    return [
      this.name
    ]
  },
  examples() {
    return []
  },
  description: 'Get a link to the Velocity bot',
	aliases: [
		'botinvite'
	],
	permission: 0,
	isPremiumCommand: false,
	commandCategory: 'info'
};