const configs = module.exports;
configs.getConfig = async (bot, server_id) => {
  let promise = new Promise(async resolve => {
    try {
      let config = await bot.db.SERVER_CONFIGS.findOne({where:{ id: server_id }});

      if(config == null) {
        return resolve(false);
      } else {
        return resolve(config);
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error fetching the config for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};

configs.setPrefix = async (bot, server_id, prefix) => {
  let promise = new Promise(async resolve => {
    try {
      let findConfig = await configs.getConfig(bot, server_id);

      if(!findConfig) {
        await bot.db.SERVER_CONFIGS.create({
          id: server_id,
          PREFIX: prefix
        });

        let newConfig = await configs.getConfig(bot, server_id);
        return resolve(newConfig);

      } else {
        await bot.db.SERVER_CONFIGS.update({
          id: server_id,
          PREFIX: prefix
        }, { where: { id: server_id } });

        let updatedConfig = await configs.getConfig(bot, server_id);
        return resolve(updatedConfig);

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error setting the prefix for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};

configs.setMessageToggled = async (bot, server_id, messageToggle) => {
  let promise = new Promise(async resolve => {
    try {
      let findConfig = await configs.getConfig(bot, server_id);

      if(!findConfig) {
        await bot.db.SERVER_CONFIGS.create({
          id: server_id,
          LEVEL_UP_MESSAGE_ENABLED: messageToggle
        });

        let newConfig = await configs.getConfig(bot, server_id);
        return resolve(newConfig);

      } else {
        await bot.db.SERVER_CONFIGS.update({
          id: server_id,
          LEVEL_UP_MESSAGE_ENABLED: messageToggle
        }, { where: { id: server_id } });

        let updatedConfig = await configs.getConfig(bot, server_id);
        return resolve(updatedConfig);

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error setting the message toggle for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};

configs.setMessageType = async (bot, server_id, messageType) => {
  let promise = new Promise(async resolve => {
    try {
      let findConfig = await configs.getConfig(bot, server_id);

      if(!findConfig) {
        await bot.db.SERVER_CONFIGS.create({
          id: server_id,
          LEVEL_UP_MESSAGE_TYPE: messageType
        });

        let newConfig = await configs.getConfig(bot, server_id);
        return resolve(newConfig);

      } else {
        await bot.db.SERVER_CONFIGS.update({
          id: server_id,
          LEVEL_UP_MESSAGE_TYPE: messageType
        }, { where: { id: server_id } });

        let updatedConfig = await configs.getConfig(bot, server_id);
        return resolve(updatedConfig);

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error setting the message type for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};

configs.setMessage = async (bot, server_id, messageContent) => {
  let promise = new Promise(async resolve => {
    try {
      let findConfig = await configs.getConfig(bot, server_id);

      if(!findConfig) {
        await bot.db.SERVER_CONFIGS.create({
          id: server_id,
          LEVEL_UP_MESSAGE: messageContent
        });

        let newConfig = await configs.getConfig(bot, server_id);
        return resolve(newConfig);

      } else {
        await bot.db.SERVER_CONFIGS.update({
          id: server_id,
          LEVEL_UP_MESSAGE: messageContent
        }, { where: { id: server_id } });

        let updatedConfig = await configs.getConfig(bot, server_id);
        return resolve(updatedConfig);

      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error setting the message content for server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;

};