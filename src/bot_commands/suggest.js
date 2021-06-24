const { MessageEmbed } = require("discord.js");

const createSuggestion = ( bot, id, userID, suggestionText ) => {
    let suggestion = { id, userID, suggestionText };
    bot.db.USER_SUGGESTIONS.create( suggestion );
};

module.exports.run = async ( bot, message, args, config, emitter ) => {
    let suggestionText = args.join( ' ' );
    if ( !suggestionText ) return message.channel.send( config.emotes.velocityCross + ' **- You need to provide a valid suggestion**' );
    if ( suggestionText.length > 200 ) return message.channel.send( config.emotes.velocityCross + ' **- Your suggestion cant be over 200 characters!**' );

    let suggestionEmbed = new MessageEmbed()
        .setTitle( 'Suggestion - ' + message.author.tag )
        .setDescription( suggestionText )
        .setFooter( message.author.id )
        .setColor( '#F8F8FF' );

    let suggestionsChannel = bot.channels.cache.find( c => c.id == config.bot.SUGGESTIONS_CHANNEL_ID );
    if ( !suggestionsChannel ) return message.channel.send( config.emotes.velocityCross + ' **- Suggestions channel not found**' );
    
    let msg = await suggestionsChannel.send( suggestionEmbed );
    msg.react( '✅' ), msg.react( '❌' );

    createSuggestion( bot, msg.id, message.author.id, suggestionText );
    
    message.channel.send( config.emotes.velocityTick + ' **- Your suggestion has been sent to the developers of Velocity Bot, thanks!**' );
};

module.exports.config = {
    name: 'suggest',
    usage() {
        return [
            this.name + ' [suggestion text]'
        ]
    },
    examples() {
        return [
            this.name + ' Add x to Velocity!'
        ]
    },
    description: 'Suggest something to be added/changed on Velocity Bot',
    aliases: [
        'suggestion'
	],
	permission: 0,
	isPremiumCommand: false,
	commandCategory: 'misc'
};