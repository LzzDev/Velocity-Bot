const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');

module.exports.run = async (bot, message, args, config, emitter) => {
	let GUILD_ID = message.guild.id;

	let embed = new MessageEmbed()
	.setTitle('Support Server')
	.setDescription('**You can join the Velocity bot support server by clicking [here]('+config.bot['SUPPORT_SERVER']+') or by visiting '+config.bot['SUPPORT_SERVER']+'**')
	.setColor(await premium.Colour(bot, GUILD_ID));

	message.channel.send(embed);

};

module.exports.config = {
	name: 'support',
	usage() {
    return [
      this.name
    ]
  },
  examples() {
    return []
  },
  description: 'Get a link to the Velocity bot support server',
	aliases: [
		'supportserver'
	],
	permission: 0,
	isPremiumCommand: false,
	commandCategory: 'misc'
};