const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');
const configs = require('../../lib/modules/configs.js');

module.exports.run = async (bot, message, args, config, emitter) => {
  let GUILD_ID = message.guild.id;
  let AUTHOR_ID = message.author.id;

  let isPremium = await premium.isPremium(bot, GUILD_ID);
  if(isPremium.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+isPremium.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'isPremium returned error: '+isPremium.error['stack']);
  };

  let serverConfig = await configs.getConfig(bot, GUILD_ID);
  if(serverConfig.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+serverConfig.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'getConfig returned error: '+serverConfig.error['stack']);
  };

  let customPrefix = serverConfig.PREFIX;

  let prefix = config.bot['BOT_PREFIX'];
  if(serverConfig && customPrefix && isPremium) prefix = customPrefix;
  
  let categorys = [];
  bot.commands.forEach(command => {
    let category;
    if(command.config['commandCategory']) {
      category = command.config['commandCategory'].toLowerCase()
    } else {
      category = 'Misc';
    };
    if(category == 'developer') return;

    let findCategory = categorys.filter(c => c.category == category);
    let commandStr = '**'+prefix+command.config['name']+' **- '+command.config['description']+'\n';
    if(findCategory.length == 0) {
      categorys.push({
        category: category,
        commands: commandStr
      });
    } else {
      let commands = findCategory[0].commands += commandStr;

      let emptiedArr = categorys.filter(c => c.category != category);
      emptiedArr.push({
        category: category,
        commands: commands
      });

      categorys = emptiedArr;
    };

  });

  let embed = new MessageEmbed()
  .setTitle(bot.user.username+' Help')
  .setFooter('Use '+prefix+'help [command] to get more detail/help!')
  .setColor(await premium.Colour(bot, GUILD_ID));

  let formatted = {
    'info':       config.emotes['velocityHelpInformation']+' Information',
    'misc':       config.emotes['velocityHelpMiscellaneous']+' Miscellaneous',
    'management': config.emotes['velocityHelpManagement']+' Management',
    'levelling':  config.emotes['velocityHelpLevelling']+' Levelling'
  };
  categorys.forEach(cat => {
    let formattedCat = (formatted[cat.category] ? formatted[cat.category] : cat.category);
    embed.addField('**'+formattedCat+'**', cat.commands, true);
  });

  let select = args[0];
  if (!select) return message.channel.send(embed);
  select = select.toLowerCase()

  let command;
  if (bot.commands.has(select)) {
    command = bot.commands.get(select);
  } else if (bot.command_aliases.has(select)) {
    command = bot.commands.get(bot.command_aliases.get(select));
  };

  if(!command) return message.channel.send(embed);
  if (command.config['commandCategory'] == 'developer') return message.channel.send(embed);

  let desc = '';
  if (command.config['aliases'].length == 0) {
    desc = command.config['description']+
    '\n\n**Usage:**\n`'+
    prefix+command.config.usage()+
    '`';
  } else {
    desc = command.config['description']+
    '\n\n**Aliases:**\n`'+
    prefix+command.config['aliases'].join('`\n`'+prefix)+
    '`\n\n**Usage:**\n`'+
    prefix+command['config'].usage().join('`\n`'+prefix)+
    '`';
  };

  if(command['config'].examples().length != 0) {
    desc += '\n\n**Examples:**\n`'+
    prefix+command['config'].examples().join('`\n`'+prefix)+
    '`';
  };

  let commandEmbed = new MessageEmbed()
  .setTitle(prefix+command.config['name'])
  .setDescription(desc)
  .setColor(await premium.Colour(bot, GUILD_ID));

  return message.channel.send(commandEmbed);

};

module.exports.config = {
	name: 'help',
	usage() {
    return [
      this.name+' <command>'
    ]
  },
  examples() {
    return [
      this.name+' ping'
    ]
  },
  description: 'Displays a list of all Velocity bot commands',
	aliases: [
    'commands'
  ],
	permission: 0,
  isPremiumCommand: false,
  commandCategory: 'info'
};