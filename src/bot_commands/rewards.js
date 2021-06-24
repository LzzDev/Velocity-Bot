const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');

module.exports.run = async (bot, message, args, config, emitter) => {
  let GUILD_ID = message.guild.id;

  let rewards = await bot.db.SERVER_REWARD_ROLES.findAll({
    where: {
      id: GUILD_ID
    },
    order: [
      ['AWARD_AT_LEVEL', 'ASC']
    ]
  })
  if(!rewards || rewards.length == 0) return message.channel.send(config.emotes['velocityCross'] + ' **- There are no reward roles in this server, to add one you can use the \`reward\` command**');

  let embed = new MessageEmbed()
	  .setTitle(message.guild.name+'\'s Reward Roles')
    .setColor(await premium.Colour(bot, GUILD_ID));

  for (let i = 0; i < rewards.length; i++) {
    let role = message.guild.roles.cache.find(r => r.id == rewards[i].ROLE_ID);
    role = role ? role.toString() : 'Invalid Role';
    
    let level = rewards[i].AWARD_AT_LEVEL ? rewards[i].AWARD_AT_LEVEL : 'Corrupted';

    embed.addField(
      '**Level ' + level + '**',
      '> ' + role + '\n\n',
      true
    );
  };

  message.channel.send(embed);
};

module.exports.config = {
  name: 'rewards',
  usage() {
    return [
      this.name,
    ]
  },
  examples() {
    return []
  },
  description: 'View a list of all the reward roles on the server',
  aliases: [
    'viewrewards'
  ],
  permission: 2,
  isPremiumCommand: false,
  commandCategory: 'levelling'
};