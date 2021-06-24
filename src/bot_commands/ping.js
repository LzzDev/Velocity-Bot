const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');

module.exports.run = async (bot, message, args, config, emitter) => {
	if (!config.bot.DEVS.includes(message.author.id)) return message.channel.send(config.emotes['velocityBotPing'] + ' **- Pong!**');
	let GUILD_ID = message.guild.id;

	let m = await message.channel.send(config.emotes['velocityLoading'] + ' **- Getting ping...**');

	let inline = true;

	let embed = new MessageEmbed()
		.setTitle('Pong!')
		.addField(`${config.emotes.velocityDiscordAPIPing} **Latency**`, `> \`${Math.round(m.createdTimestamp - message.createdTimestamp)}ms\``, inline)
		.addField('\u200b', '\u200b', inline)
		.addField(`${config.emotes.velocityBotPing} **API**`, `> \`${Math.round(bot.ws.ping)}ms\``, inline)
		.setColor(await premium.Colour(bot, GUILD_ID));
	
	m.edit( null, { embed } )
		.catch(e => message.channel.send(config.emotes['velocityCross'] + ' **- An error has occurred, please try again later**'));
};

module.exports.config = {
	name: 'ping',
	usage() {
    return [
      this.name,
    ]
  },
  examples() {
    return []
  },
  description: 'Get the latency and ping for Velocity bot',
	aliases: [],
	permission: 0,
	isPremiumCommand: false,
	commandCategory: 'info'
};