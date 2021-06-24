const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');
const moment = require('moment');
require('moment-precise-range-plugin');

module.exports.run = async (bot, message, args, config, emitter) => {
  let GUILD_ID = message.guild.id;
  let AUTHOR_ID = message.author.id;

  let isPremium = await premium.isPremium(bot, GUILD_ID);
  if(isPremium.hasOwnProperty('error')) {
    message.channel.send('⚠️```'+isPremium.error['message']+'```**Please notify the support team of this error on the Velocity support server**');
    return emitter.emit('log', 'isPremium returned error: '+isPremium.error['stack']);
  };

  let action = args[ 0 ];
  let sID = args[ 1 ];
  if( action && sID && config.bot[ 'DEVS' ].includes( AUTHOR_ID ) ) {
    if( !bot.guilds.cache.get( sID ) ) return message.channel.send( config.emotes['velocityCross'] + ' **- Server ID provided is not a valid server ID**' )

    let targetIsPremium = await premium.isPremium( bot, sID );
    if( targetIsPremium.hasOwnProperty( 'error' ) ) {
      message.channel.send( '⚠️```' + targetIsPremium.error[ 'message' ] + '```**Please notify the support team of this error on the Velocity support server**' );
      return emitter.emit( 'log', 'isPremium returned error: ' + targetIsPremium.error[ 'stack' ] );
    };

    if( action.toLowerCase() == "add" ) {
      if(targetIsPremium) return message.channel.send( config.emotes['velocityCross'] + ' **- Server ID** `' + sID + '` **already has premium features activated**' )

      let premiumAdd = await premium.Add( bot, sID, AUTHOR_ID );
      if( premiumAdd.hasOwnProperty( 'error' ) ) {
        message.channel.send( '⚠️```' + premiumAdd.error[ 'message' ] + '```**Please notify the support team of this error on the Velocity support server**' );
        return emitter.emit( 'log', 'isPremium returned error: ' + premiumAdd.error[ 'stack' ] );
      };

      return message.channel.send( config.emotes['velocityTick'] + ' **- Premium features have been activated for server ID** `' + sID + '`' );
    } else if( action.toLowerCase() == "remove" ) {
      if(!targetIsPremium) return message.channel.send( config.emotes['velocityCross'] + ' **- Server ID** `' + sID + '` **does not have premium features activated**' )

      let premiumRemove = await premium.Remove( bot, GUILD_ID );
      if( premiumRemove.hasOwnProperty( 'error' ) ) {
        message.channel.send( '⚠️```' + premiumRemove.error[ 'message' ] + '```**Please notify the support team of this error on the Velocity support server**' );
        return emitter.emit( 'log', 'isPremium returned error: ' + premiumRemove.error[ 'stack' ] );
      };

      return message.channel.send( config.emotes['velocityTick'] + ' **- Premium features have been removed from server ID** `' + sID + '`' );
    };
  };

  let desc;
  if(isPremium) {
    let premiumDetails = await bot.db.SERVER_PREMIUM.findOne({where:{ id: GUILD_ID }});
    if(premiumDetails || premiumDetails.createdAt) {
      let activatedAt = moment(premiumDetails.createdAt,'YYYY-MM-DD HH:mm:ss');
      let now = moment(new Date(),'YYYY-MM-DD HH:mm:ss');
      let humanLength = moment.duration(activatedAt.diff(now)).humanize();

      desc = config.emotes['velocityTick'] + ' **- Premium features are activated on this server and have been for '+humanLength+', thank you!**';
    } else {
      desc = config.emotes['velocityTick'] + ' **- Premium features are activated on this server, thank you!**';
    };
    
  } else {
    desc = config.emotes['velocityCross'] + ' **- Premium features are not activated on this server, premium can be purchased by clicking [here]('+config.bot['SUPPORT_SERVER']+') or by visiting '+config.bot['SUPPORT_SERVER']+'**'
  };

  let embed = new MessageEmbed()
	.setTitle('Premium')
	.setDescription(desc)
  .setColor(await premium.Colour(bot, GUILD_ID));

  message.channel.send(embed);

};

module.exports.config = {
	name: 'premium',
	usage() {
    return [
      this.name,
    ]
  },
  examples() {
    return []
  },
  description: 'Check if the server is premium or not',
	aliases: [
		'checkprem'
	],
	permission: 1,
	isPremiumCommand: false,
	commandCategory: 'misc'
};