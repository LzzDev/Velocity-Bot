const { MessageEmbed } = require('discord.js');
const os = require('os');
const premium = require('../../lib/modules/premium.js');

const numeral = require( 'numeral' );
const format = num => numeral(num).format( '0.[00]a' );


module.exports.run = async (bot, message, args, config, emitter) => {
  const GUILD_ID = message.guild.id;

  const statsEmbed = new MessageEmbed()
    .setTitle(bot.user.username + ' Stats')
    .setColor(await premium.Colour(bot, GUILD_ID));
  
  const stats = [
    [
      'Bot Stats',
      '**Guilds:** '        + format(bot.guilds.cache.size),
      '**Users:** '         + format(bot.users.cache.size),
      '**Channels:** '      + format(bot.channels.cache.size)
    ],

    [
      'Bot Times',
      '**Bot Uptime:** '    + bot.ms.length(bot.uptime),
      '**Server Uptime:** ' + bot.ms.humanize(os.uptime() * 1000),
      '**Ready At:** '      + bot.readyAt.toLocaleString()
    ],

    [
      'Bot Commands',
      '**Command Count:** ' + bot.commands.size,
    ],

    [
      'Memory',
      '**Total Memory:** '  + os.totalmem(),
      '**Free Memory:** '   + os.freemem()
    ]
  ];

  stats.map(cat => {
    statsEmbed.addField(
      cat[0],
      
      cat
        .filter(stat => stat != cat[0])
        .map(stat => '> ' + stat)
    );
  });

  message.channel.send(statsEmbed);
};

module.exports.config = {
	name: 'stats',
	usage() {
    return [
      this.name
    ]
  },
  examples() {
    return []
  },
  description: 'Gather various information/stats about the bot',
	aliases: [
    'info',
    'debug'
  ],
	permission: 4,
  isPremiumCommand: false,
  commandCategory: 'developer'
};