const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');
function clean(text) {
  if (typeof(text) === "string") {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  } else {
    return text;
  };
};

module.exports.run = async (bot, message, args, config, emitter) => {
  if (args.length == 0) return message.channel.send(config.emotes['velocityCross'] + ' **- You need to provide a string to eval**');

  try {
    let code = args.join(' ');
    
    let evaled;
    if (code.includes('await')) {
      evaled = eval('(async () => {'+code+'})()');
    } else {
      evaled = eval(code);
    };
// 
    if (typeof evaled != "string") evaled = require("util").inspect(evaled, {depth: 0});

    const secrets = [
      bot.token
    ];
    const leaks = [];

    secrets.forEach( secret => {
      if ( code.toLowerCase().includes( secret.toLowerCase() ) || evaled.toLowerCase().includes( secret.toLowerCase() ) ) leaks.push( true );
    } );

    const secretRevealed = new MessageEmbed()
      .setDescription('Prevented secret leak')
      .setColor('RED');
    if ( leaks.length != 0 ) return message.channel.send( secretRevealed );

    console.log( clean(evaled) )
    let embed = new MessageEmbed()
    .setDescription('📤```js\n'+clean(evaled)+'\n```')
    .setColor(await premium.Colour(bot, message.guild.id));

    message.channel.send(embed);
  } catch (err) {
    message.channel.send('⚠️```'+clean(err)+'```**An error has occured**');
  };

};

module.exports.config = {
	name: 'eval',
	usage() {
    return [
      this.name+' [string]'
    ]
  },
  examples() {
    return []
  },
  description: 'Evaluates JavaScript code represented as a string',
	aliases: [],
	permission: 4,
  isPremiumCommand: false,
  commandCategory: 'developer'
};