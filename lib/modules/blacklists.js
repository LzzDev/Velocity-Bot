const fileName = __filename.substr(__filename.lastIndexOf('\\') + 1, __filename.length);

const blacklists = module.exports;
blacklists.isUserBlacklisted = async (bot, user_id) => {
  let promise = new Promise(async resolve => {
    try {
      let user = await bot.db.USER_BLACKLISTS.findOne({where:{ id: user_id }});

      let isUserBlacklisted;
      if(user == null) {
        isUserBlacklisted = false;
      } else {
        isUserBlacklisted = true
      };

      return resolve(isUserBlacklisted);

    } catch(e) {

      return resolve({
        error: {
          message: 'Error: Couldn\'t check user ID '+user_id+' for an active blacklist\n\tat blacklists.isUserBlacklisted ('+fileName+')',
          stack: e
        }
      });

    };

  });

  return promise;

};

blacklists.isServerBlacklisted = async (bot, server_id) => {
  let promise = new Promise(async resolve => {
    try {
      let server = await bot.db.SERVER_BLACKLISTS.findOne({where:{ id: server_id }});

      let isServerBlacklisted;
      if(server == null) {
        isServerBlacklisted = false;
      } else {
        isServerBlacklisted = true
      };

      return resolve(isServerBlacklisted);

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error checking server ID '+server_id+' for a blacklist',
          stack: e
        }
      });

    };

  });

  return promise;

};

blacklists.addUserBlacklist = async (bot, user_id, blacklisted_by) => {
  let promise = new Promise(async resolve => {
    try {
      let isUserBlacklisted = await blacklists.isUserBlacklisted(bot, user_id);

      if(isUserBlacklisted) {
        return resolve(true);
      } else {
        await bot.db.USER_BLACKLISTS.create({
          id: user_id,
          BLACKLISTED_BY: blacklisted_by
        });

        return resolve(true)

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error adding user ID '+user_id+' to a blacklist',
          stack: e
        }
      });

    };

  });

  return promise;

};

blacklists.addServerBlacklist = async (bot, server_id, blacklisted_by) => {
  let promise = new Promise(async resolve => {
    try {
      let isServerBlacklisted = await blacklists.isServerBlacklisted(bot, server_id);

      if(isServerBlacklisted) {
        return resolve(true);
      } else {
        await bot.db.SERVER_BLACKLISTS.create({
          id: server_id,
          BLACKLISTED_BY: blacklisted_by
        });

        return resolve(true)

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error adding server ID '+server_id+' to a blacklist',
          stack: e
        }
      });

    };

  });

  return promise;

};