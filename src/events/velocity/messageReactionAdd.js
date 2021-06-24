const { MessageEmbed } = require("discord.js");

module.exports = function( emitter, bot, config ) {
    bot.on( 'raw', packet => {
        if ( packet.t != 'MESSAGE_REACTION_ADD' ) return;

        let channel = bot.channels.cache.find( c => c.id == packet.d.channel_id );

        if ( channel.id != config.bot.SUGGESTIONS_CHANNEL_ID ) return;

        channel.messages.fetch( packet.d.message_id ).then( async message => {
            let suggestion = await bot.db.USER_SUGGESTIONS.findOne( { where: { id: message.id } } );
            let isSuggestion = suggestion ? true : false;

            if ( !isSuggestion ) return;

            let reactor = packet.d.member.user.id;
            let reactorWasDev = config.bot.DEVS.includes( reactor );
            
            if ( !reactorWasDev ) return;

            let emoji = packet.d.emoji.name;
            if ( emoji != '✅' && emoji != '❌' ) return;
            let suggestionWasAccepted = emoji == '✅' ? true : false;


            let suggestionUpdateEmbed = new MessageEmbed()
                .setTitle( message.embeds[ 0 ].title + ' | (Marked as approved)' )
                .setDescription( message.embeds[ 0 ].description )
                .setThumbnail( 'https://i.imgur.com/9YpaIVZ.png' )
                .setFooter( message.embeds[ 0 ].footer.text )
                .setColor( message.embeds[ 0 ].color );

            if ( suggestionWasAccepted ) {
                message.edit( suggestionUpdateEmbed );
                message.clearReactions();
            } else
                message.delete();
            
            
            let user = bot.users.cache.find( u => u.id == suggestion.userID );
            if ( !user ) return;
            
            let suggestionUpdateFeedbackEmbed = new MessageEmbed()
                .setTitle( bot.user.username + ' Suggestion - Feedback' )
                .setDescription( [
                    'Your suggestion for ' + bot.user.username + ' was ' + (
                        suggestionWasAccepted
                        ? 'accepted! Thank you for your suggestion, it will be implemented shortly if not already.'
                        : 'denied. Although it was appreciated!'
                    ),
                    '',
                    'Your Suggestion:',
                    '```',
                    suggestion.suggestionText,
                    '```'
                ] )
                .setColor( '#F8F8FF' );
            
            user.send( suggestionUpdateFeedbackEmbed ).catch( e => message.channel.send( 'Error sending DM to user ' + user.tag + ', \`' + e.message + '`' ) );

            await bot.db.USER_SUGGESTIONS.destroy( { where: { id: message.id } } );
        });

    });
};

module.exports.config = {
    disabled: false
};