const axios = require('axios');
let BASE_URL = 'https://mee6.xyz/api/plugins/levels/leaderboard/';
module.exports.run = async ( bot, message, args, config, emitter ) => {
    let MEE6data = await axios.get( BASE_URL + message.guild.id )
        .catch( e => {
            console.log( e )
            if ( e.response.status == 404 ) {
                message.channel.send( config.emotes.velocityCross + ' **- Your guild could not be found in the MEE6 database, make sure MEE6 is on this server**' );
            } else {
                if ( !id ) message.channel.send( config.emotes.velocityCross + ' **- An error occured while attempting to fetch your guilds data, please report the following error to the Velocity support server: \`' + e.message + '\`**'  );
            };
            return false;
        });

    if ( !MEE6data ) return;

    let stats = { creates: 0, updates: 0 };
    let members = MEE6data.data.players;

    for (let i = 0; i < members.length; i++) {
        let member = members[ i ];
        let findMember = await bot.db.USER_XP.findOne( { where: { id: member.id } } );

        stats[ findMember ? 'updates' : 'creates' ]++;

        if ( findMember ) {
            //
        } else {
            //
        };
    };
    
    message.channel.send( config.emotes.velocityTick + ' **- Updated ' + stats.updates + ' users and created ' + stats.creates + ' users**' );
    
};

module.exports.config = {
    name: 'mee6',
	usage() {
        return [
            this.name,
        ]
    },
    examples() {
        return []
    },
    description: 'Sync Velocity guild data with existing MEE6 guild data',
    aliases: [
        'sync',
        'mee6sync',
        'syncmee6'
    ],
    permission: 4,
    isPremiumCommand: false,
    commandCategory: 'info'
};