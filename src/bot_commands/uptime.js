const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');


module.exports.run = async (bot, message, args, config, emitter) => {
    let embed = new MessageEmbed()
        .addField(':robot: Bot', 
            '> `' + bot.ms.length(bot.uptime) + '`\n> `' + bot.ms.humanize(bot.uptime) + '`'
        )
        .addField(':desktop: Server', '> `' + bot.ms.length(require('os').uptime() * 1000) + '`\n> `' + bot.ms.humanize(require('os').uptime() * 1000) + '`')
        .setColor(await premium.Colour(bot, message.guild.id));
        
    message.channel.send(embed);
};

module.exports.config = {
    name: 'uptime',
	usage() {
        return []
    },
    examples() {
        return []
    },
    description: 'Shows how long the bot has been online for',
    aliases: [],
    permission: 4,
    isPremiumCommand: false,
    commandCategory: 'developer'
};