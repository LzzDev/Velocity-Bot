const leaderboards = module.exports;
leaderboards.getLeaderboard = async (bot, server_id) => {
  let promise = new Promise(async resolve => {
    try {
      let leaderboard = await bot.db.SERVER_STATIC_LEADERBOARD.findOne({where:{ id: server_id }});

      if(leaderboard == null) {
        return resolve(false);
      } else {
        return resolve(leaderboard);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error fetching the leaderboard for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};

leaderboards.setChannel = async (bot, server_id, leaderboardChannel) => {
  let promise = new Promise(async resolve => {
    try {
      let findLeaderboard = await leaderboards.getLeaderboard(bot, server_id);

      if(!findLeaderboard) {
        await bot.db.SERVER_STATIC_LEADERBOARD.create({
          id: server_id,
          STATIC_LEADERBOARD_CHANNEL: leaderboardChannel
        });

        let newLeaderboard = await leaderboards.getLeaderboard(bot, server_id);
        return resolve(newLeaderboard);

      } else {
        await bot.db.SERVER_STATIC_LEADERBOARD.update({
          id: server_id,
          STATIC_LEADERBOARD_CHANNEL: leaderboardChannel
        }, { where: { id: server_id } });

        let updatedLeaderboard = await leaderboards.getLeaderboard(bot, server_id);
        return resolve(updatedLeaderboard);

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error setting the leaderboard channel for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};