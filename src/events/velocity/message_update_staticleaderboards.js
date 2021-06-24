const { MessageEmbed } = require('discord.js');
const premium = require('../../../lib/modules/premium.js');

module.exports = function(emitter, bot, config) {
  bot.on('message', async message => {
    if(message.author.bot == true) return;
    if(message.channel.type == 'dm') return;
  
    let GUILD_ID = message.guild.id;

    let isPremium = await premium.isPremium(bot, GUILD_ID);
    if(isPremium.hasOwnProperty('error')) {
      message.react('⚠️').catch(e => console.log('Error reacting to message on guild ID '+GUILD_ID));
      return emitter.emit('log', 'isPremium returned error: '+isPremium.error['stack']);
    };
    if(!isPremium) return;

    let staticLeaderboard = await bot.db.SERVER_STATIC_LEADERBOARD.findOne({where: { id: GUILD_ID }});
    if(!staticLeaderboard) return;
    
    let channel = message.guild.channels.cache.find(c => c.id == staticLeaderboard.STATIC_LEADERBOARD_CHANNEL);
    if(!channel) return;

    let messageCount = staticLeaderboard.MESSAGE_COUNT;
    if(!messageCount) messageCount = 0;

    if(messageCount == 9) {
      await bot.db.SERVER_STATIC_LEADERBOARD.update({
        MESSAGE_COUNT: 0
      }, { where: { id: GUILD_ID } });

      let leaderboard = await bot.db.USER_XP.findAll({
        where: {
          SERVER_ID: GUILD_ID
        },
        limit: 10,
        order: [
          ['TOTAL_XP_EARNED', 'DESC']
        ]
      }).catch(e => {
        return emitter.emit('log', 'getLeaderboard data returned error: '+e['stack']);
      });
    
      if(leaderboard.length == 0) return;

      let chartData = [];
      for (let i = 0; i < leaderboard.length; i++) {
        let id = leaderboard[i].id;
        let USER_TAG = leaderboard[i].USER_TAG;
    
        let user = bot.users.cache.get(id);
        if(!user && USER_TAG) {
          user = USER_TAG;
        } else if(!user && !USER_TAG) {
          user = id+' (Unknown)';
        } else {
          user = user.tag;
        };
    
        let userChartData = {
          'label': user,
          'data': [leaderboard[i].TOTAL_XP_EARNED]
        };
        chartData.push(userChartData);

      };
    
      let chartConfig = {
        'type': 'bar',
        'data': {
          'labels': [
            'Total XP Earned'
          ],
          'datasets': chartData
        }
      };

      let embed = new MessageEmbed()
      .setTitle('Leaderboard (Top '+leaderboard.length+')')
      .setColor(await premium.Colour(bot, GUILD_ID))
      .setImage( 'https://quickchart.io/chart?c=' + encodeURIComponent( JSON.stringify( chartConfig ) ) + '&width=400&height=300' || null );

      let messageID = staticLeaderboard.MESSAGE_ID;
      if(!messageID) {
        let createLeaderboard = await channel.send(embed);

        if(createLeaderboard) {
          await bot.db.SERVER_STATIC_LEADERBOARD.update({
            MESSAGE_ID: createLeaderboard.id
          }, { where: { id: GUILD_ID } });
        };

        return;

      };
      
      // let lbMessage = await channel.fetchMessage(messageID)
      let lbMessage = await channel.messages.fetch(messageID)
      .then(async lbMessage => {
        lbMessage.edit(embed);
      })
      .catch(async () => {
        let newLeaderboard = await channel.send(embed);

        if(newLeaderboard) {
          await bot.db.SERVER_STATIC_LEADERBOARD.update({
            MESSAGE_ID: newLeaderboard.id
          }, { where: { id: GUILD_ID } });
        };
      });

    } else {
      await bot.db.SERVER_STATIC_LEADERBOARD.update({
        MESSAGE_COUNT: parseInt(messageCount) + 1
      }, { where: { id: GUILD_ID } });
    };

  });
};

module.exports.config = {
  disabled: false
};