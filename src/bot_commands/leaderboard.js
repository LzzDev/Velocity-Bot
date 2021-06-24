const { MessageEmbed } = require('discord.js');
const premium = require('../../lib/modules/premium.js');
const levels = require('../../lib/modules/levels.js');
const configs = require('../../lib/modules/configs.js');

const Chart = require('quickchart-js');

const numeral = require( 'numeral' );
const format = num => numeral(num).format( '0.[00]a' );


module.exports.run = async (bot, message, args, config, emitter) => {
    let GUILD_ID = message.guild.id;
    
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
    
    let leaderboard = await bot.db.USER_XP.findAll({ where: {SERVER_ID: GUILD_ID}, limit: 10, order: [['TOTAL_XP_EARNED', 'DESC']]}).catch(e => {
        message.channel.send('⚠️```Error getting leaderboard data for server ID '+GUILD_ID+'```**Please notify the support team of this error on the Velocity support server**');
        return emitter.emit('log', 'getLeaderboard data returned error: '+e['stack']);
    });
    
    if(leaderboard.length == 0) return message.channel.send(config.emotes['velocityCross'] + ' **- No one is ranked in this server**');
    
    let leaderboardEmbed = new MessageEmbed()
        .setTitle('Leaderboard - ' + message.guild.name)
        .setColor(await premium.Colour(bot, GUILD_ID));

    let leaderboardChart = new Chart()
        .setConfig({
            type: 'bar',
            data: {
                labels: leaderboard.map(user => {
                    let botUser = bot.users.cache.get(user.id);
                    if(!botUser && user.USER_TAG) {
                        botUser = user.USER_TAG;
                    } else if(!botUser && !user.USER_TAG) {
                        botUser = id + ' (Unknown)';
                    } else {
                        botUser = botUser.tag;
                    };

                    user.lbName = botUser;

                    return botUser;
                }),
                datasets: [ {
                    label: 'Level',
                    data: leaderboard
                        .map((user, index) => {
                            const leaderboardRank = (isPremium && config.emotes.hasOwnProperty('velocityLeaderboard' + (index + 1))? config.emotes['velocityLeaderboard' + (index + 1)] : '**(' + (index + 1) + '.)**') + ' ';
                            const leaderboardUser = leaderboardRank + user.lbName;

                            // const leaderboardEntry = '**Level:** ' + numeral( memberStats.LEVEL_XP ).format( '0.[00]a' ) + '/' + numeral( memberStats.TOTAL_LEVEL_XP ).format( '0.[00]a' ) + ' XP';
                            const leaderboardEntry = '**Level:** ' + user.LEVEL + ' (' + format( user.LEVEL_XP ) + '/' + format( levels.getLevelXP(user.LEVEL) ) + ')';

                            leaderboardEmbed.addField(leaderboardUser, leaderboardEntry, true);

                            return user.LEVEL;
                        })
                        .sort(() => -1)
                        .map(level => level)
                } ]
            }
        })
        .setWidth(400)
        .setHeight(300);
    
    if (isPremium) {
        leaderboardEmbed
            .setImage(leaderboardChart.getUrl())
            .setFooter('You can use the ' + prefix + 'staticleaderboard command to get an auto-updating version of this leaderboard in its own channel');
    };

    message.channel.send(leaderboardEmbed).catch(e => {});
};

module.exports.config = {
    name: 'leaderboard',
    usage() {
        return [this.name];
    },
    examples() {
        return [];
    },
    description: 'View the servers leaderboard',
    aliases: ['lb'],
    permission: 0,
    isPremiumCommand: false,
    commandCategory: 'levelling'
};