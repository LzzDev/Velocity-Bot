const levels = require('../../lib/modules/levels.js');
const { MessageAttachment } = require( 'discord.js' );
const numeral = require( 'numeral' );


// Canvas
const { createCanvas, loadImage } = require( 'canvas' );

const canvasWidth = 1000, canvasHeight = 300;
const canvas = createCanvas( canvasWidth, canvasHeight );
const ctx = canvas.getContext( '2d' );

const sizeText = ( text, fontface, fontsize = 300, maxWidth = canvas.width ) => {
    do {
        fontsize--;
        ctx.font = fontsize + 'px ' + fontface;
    } while( ctx.measureText( text ).width > maxWidth );

    return ctx.font;
};

let text, x, y, size, family, colour, align;

module.exports.run = async ( bot, message, args, config, emitter ) => {
    let SERVER_ID = message.guild.id;

    let member = message.guild.members.cache.get( args[ 0 ] ) || message.guild.member( message.mentions.users.first() ) || message.author;
    if ( member == message.author ) member.user = message.author;

    if ( member.user.bot == true ) return message.channel.send( config.emotes.velocityCross + ' **- The user you have provided is a bot, bots cannot be ranked**' );


    let user = await bot.db.USER_XP.findOne( { where: { id: member.user.id, SERVER_ID } } );
    if ( !user ) return message.channel.send( config.emotes.velocityCross + ' **- '
        + ( member == message.author ? 'You are' : 'The user you have provided is' )
        + ' not ranked on this server yet, to get ranked ' + ( member == message.author ? '' : 'they need to ' ) + 'start typing**' );
    
    
    let memberStats = await levels.getUser( bot, SERVER_ID, member.user.id );

    if ( !memberStats.TOTAL_XP_EARNED ) memberStats.TOTAL_XP_EARNED = 0;
    if ( !memberStats.LEVEL_XP ) memberStats.LEVEL_XP = 0;
    if ( !memberStats.LEVEL ) memberStats.LEVEL = 0;
    if ( !memberStats.TOTAL_LEVEL_XP ) memberStats.TOTAL_LEVEL_XP = levels.getLevelXP( memberStats.LEVEL );
    
    
    let guildLeaderboard = await bot.db.USER_XP.findAll( { where: { SERVER_ID }, order: [ [ 'TOTAL_XP_EARNED', 'DESC' ] ] } );
    let memberLeaderboardRank = parseInt( guildLeaderboard.indexOf( guildLeaderboard.find( u => u.id == member.id && u.TOTAL_XP_EARNED == memberStats.TOTAL_XP_EARNED ) ) ) + 1;


    /* Card background colour */
    ctx.fillStyle = '#404040';
    ctx.fillRect( 0, 0, canvasWidth, canvasHeight );
    /* ---------- */


    /* Avatar image */
    // let avatarURL = member.user.avatarURL().endsWith( '.webp' ) ? member.user.avatarURL().slice(9, -70) + '.gif' : member.user.avatarURL();
    let avatarURL = member.user.avatarURL();
    if ( avatarURL.endsWith( '.webp' ) ) avatarURL = avatarURL.slice( 0, avatarURL.length - 5 ) + '.png';
    
    const avatar = await loadImage( avatarURL );
    ctx.drawImage( avatar, 0, 0, canvasHeight, canvasHeight );
    /* ---------- */

    
    /* Progress bar background */
    ctx.beginPath();
    ctx.fillStyle = '#2B2B2B';
    ctx.fillRect( canvasHeight, 0, 15, canvasHeight );
    /* ---------- */


    /* Progress bar */
    let progressPercentage = memberStats.LEVEL_XP / memberStats.TOTAL_LEVEL_XP;
    let progressHeight = canvasHeight * ( 1 - progressPercentage );

    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect( canvasHeight, progressHeight, 15, canvasHeight - progressHeight );
    ctx.arc( canvasHeight + 7.5, progressHeight + 2, 7.5, 0, 90, false );
    ctx.fill();
    /* ---------- */


    /* Card background image */
    let memberConfig = await bot.db.USER_CONFIGS.findOne( { where: { id: member.user.id } } );
    if ( memberConfig && memberConfig.RANK_CARD_IMAGE && levels.validURL( memberConfig.RANK_CARD_IMAGE ) ) {
        const strip = row => row.dataValues;
        
        let ownedPremiumGuilds = [];

        let premiumGuilds = await bot.db.SERVER_PREMIUM.findAll();
        for ( let i = 0; i < premiumGuilds.length; i++ ) {
            const premGuild = strip( premiumGuilds[ i ] );
    
            const guild = bot.guilds.cache.find( g => g.id == premGuild.id );
            const isValidGuild = guild ? true : false;
    
            if ( !isValidGuild ) continue;
            if ( guild.owner.id != member.user.id ) continue;
    
            ownedPremiumGuilds.push( guild.id );
        };
        

        if ( ownedPremiumGuilds.length >= 1) {
            const background = await loadImage( memberConfig.RANK_CARD_IMAGE );
            ctx.drawImage( background, canvasHeight + 15, 0, canvasWidth - canvasHeight - 15, canvasHeight );
        };
    };
    /* ---------- */


    /* Username text */
    text = member.user.username;
    x = 100, y = 100;
    size = 45, family = 'Lucida Sans';
    colour = '#FFFFFF', align = 'left';
    //
    ctx.font = sizeText( text, family, size, canvasWidth - canvasHeight - 7.5 - 40 - 225 );
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText( text, canvasHeight + 7.5 + 40, canvasHeight - 200 );
    /* ---------- */


    /* Discriminator text */
    let usernameTextWidth = ctx.measureText( text ).width;
    
    text = '#' + member.user.discriminator;
    x = 100, y = 100;
    size = 35, family = 'Lucida Console';
    colour = '#9D9D9D', align = 'left';
    //
    ctx.font = sizeText( text, family, size, canvasWidth - canvasHeight - 7.5 - 40 - 100 );
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText( text, canvasHeight + 7.5 + 40 + usernameTextWidth, canvasHeight - 200 );
    /* ---------- */


    /* Rank text */
    text = '#' + numeral( memberLeaderboardRank ).format( '0a' );
    x = 100, y = 100;
    size = 45, family = 'Lucida Sans';
    colour = '#FFFFFF', align = 'right';
    //
    ctx.font = sizeText( text, family, size, canvasWidth - canvasHeight - 7.5 - 40 - 100 );
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText( text, canvasWidth - 40, canvasHeight - 200 );
    /* ---------- */


    /* Level text */
    text = 'Level ' + numeral( memberStats.LEVEL ).format( '0a' );
    x = 100, y = 100;
    size = 45, family = 'Lucida Sans';
    colour = '#FFFFFF', align = 'left';
    //
    ctx.font = sizeText( text, family, size, canvasWidth - canvasHeight - 7.5 - 40 - 350 );
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText( text, canvasHeight + 7.5 + 40, canvasHeight - 85 );
    /* ---------- */


    /* Level XP text */
    text = numeral( memberStats.LEVEL_XP ).format( '0.[00]a' ) + '/' + numeral( memberStats.TOTAL_LEVEL_XP ).format( '0.[00]a' ) + ' XP';
    x = 100, y = 100;
    size = 30, family = 'Lucida Console';
    colour = '#9D9D9D', align = 'left';
    //
    ctx.font = sizeText( text, family, size, canvasWidth - canvasHeight - 7.5 - 40 - 100 );
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText( text, canvasHeight + 7.5 + 40, canvasHeight - 50 );
    /* ---------- */


    /* Total XP text */
    text = numeral( memberStats.TOTAL_XP_EARNED ).format( '0a' );
    x = 100, y = 100;
    size = 45, family = 'Lucida Sans';
    colour = '#FFFFFF', align = 'right';
    //
    ctx.font = sizeText( text, family, size, canvasWidth - canvasHeight - 7.5 - 40 - 350 );
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText( text, canvasWidth - 40, canvasHeight - 85 );
    /* ---------- */


    /* Total XP earned text */
    text = 'XP EARNED';
    x = 100, y = 100;
    size = 30, family = 'Lucida Console';
    colour = '#9D9D9D', align = 'right';
    //
    ctx.font = sizeText( text, family, size, canvasWidth - canvasHeight - 7.5 - 40 - 100 );
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.fillText( text, canvasWidth - 40, canvasHeight - 50 );
    /* ---------- */


    let rankCard = new MessageAttachment( canvas.toBuffer(), member.user.id + '_rank_card-' + bot.user.username + '.png' );
    message.channel.send( rankCard );
};

module.exports.config = {
    name: 'rank',
    usage() {
      return [
        this.name+' [user]',
      ]
    },
    examples() {
      return [
        this.name,
        this.name+' @someUser'
      ]
    },
    description: 'Get the rank of a user',
    aliases: [
      'level',
      'xp',
      'rankcard'
    ],
    permission: 0,
    isPremiumCommand: false,
    commandCategory: 'levelling'
};