const rewards = module.exports;
rewards.getRewardByLevel = async (bot, server_id, level) => {
  let promise = new Promise(async resolve => {
    try {
      let reward = await bot.db.SERVER_REWARD_ROLES.findOne({where:{ id: server_id, AWARD_AT_LEVEL: level }});

      if(reward == null) {
        return resolve(false);
      } else {
        return resolve(reward);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error getting reward role for level '+level+' for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;
  
};

rewards.getRewardByRole = async (bot, server_id, role_id) => {
  let promise = new Promise(async resolve => {
    try {
      let reward = await bot.db.SERVER_REWARD_ROLES.findOne({where:{ id: server_id, ROLE_ID: role_id }});

      if(reward == null) {
        return resolve(false);
      } else {
        return resolve(reward);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error getting reward role for role ID '+role_id+' for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;
  
};

rewards.getReward = async (bot, server_id, role_id, level) => {
  let promise = new Promise(async resolve => {
    try {
      let reward = await bot.db.SERVER_REWARD_ROLES.findOne({where:{ id: server_id, ROLE_ID: role_id, AWARD_AT_LEVEL: level }});

      if(reward == null) {
        return resolve(false);
      } else {
        return resolve(reward);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error getting reward role for role ID '+role_id+' on level '+level+' for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};

rewards.addReward = async (bot, server_id, role_id, level) => {
  let promise = new Promise(async resolve => {
    try {
      let getReward = await rewards.getReward(bot, server_id, role_id, level);

      if(!getReward) {
        await bot.db.SERVER_REWARD_ROLES.create({
          id: server_id,
          ROLE_ID: role_id,
          AWARD_AT_LEVEL: level
        });

        let newReward = await rewards.getReward(bot, server_id, role_id, level);
        return resolve(newReward);

      } else {
        await bot.db.SERVER_REWARD_ROLES.update({
          id: server_id,
          ROLE_ID: role_id,
          AWARD_AT_LEVEL: level
        }, { where: { id: server_id, AWARD_AT_LEVEL: level } });

        let updatedReward = await getReward(bot, server_id, role_id, level);
        return resolve(updatedReward);

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error adding reward role for level '+level+' on role ID '+role_id+' for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};

rewards.removeRewardByLevel = async (bot, server_id, level) => {
  let promise = new Promise(async resolve => {
    try {
      let getReward = await rewards.getRewardByLevel(bot, server_id, level);

      if(getReward) {
        await bot.db.SERVER_REWARD_ROLES.destroy({ where: { id: server_id, AWARD_AT_LEVEL: level } });

        return resolve(true);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error removing reward role for level '+level+' on server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;
};

rewards.removeRewardByRole = async (bot, server_id, role_id) => {
  let promise = new Promise(async resolve => {
    try {
      let getReward = await rewards.getRewardByRole(bot, server_id, role_id);

      if(getReward) {
        await bot.db.SERVER_REWARD_ROLES.destroy({ where: { id: server_id, ROLE_ID: role_id } });

        return resolve(true);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error removing reward role for role ID '+role_id+' on server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;
};