const levels = module.exports;
levels.genXP = function(min, max) {
  return Math.round( Math.random() * ( max - min ) + min );
};

levels.getLevelXP = function(level) {
  return 5 * (level ** 2) + 50 * level + 75;
};

levels.isCommand = function(bot, command) {
  if(bot.commands.has(command)) {
    return true;
  } else if(bot.command_aliases.has(command)) {
    return true;
  } else {
    return false;
  };
};

levels.getUser = async (bot, server_id, user_id) => {
  let promise = new Promise(async resolve => {
    try {
      let findUser = await bot.db.USER_XP.findOne({ where: { id: user_id, SERVER_ID: server_id } });

      if(!findUser) {
        await bot.db.USER_XP.create({
          id: user_id,
          SERVER_ID: server_id,
          TOTAL_XP_EARNED: 0,
          LEVEL_XP: 0,
          LEVEL: 0
        });

        let newUser = await bot.db.USER_XP.findOne({ where: { id: user_id, SERVER_ID: server_id } });
        return resolve(newUser);

      } else {
        return resolve(findUser);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error getting user ID '+user_id+' for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;
  
};

levels.validURL = string => {
  if ( !string ) return null;
  
  let res = string.match(/\.(jpeg|jpg|gif|png)$/)
  return ( res !== null );
};