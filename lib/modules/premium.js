const premium = module.exports;
premium.isPremium = async (bot, server_id) => {
  let promise = new Promise(async resolve => {
    try {
      let server = await bot.db.SERVER_PREMIUM.findOne({where:{ id: server_id }});

      let isPremium;
      if(server == null) {
        isPremium = false;
      } else {
        isPremium = true
      };

      return resolve(isPremium);

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error checking server ID '+server_id+' for premium features',
          stack: e
        }
      });

    };

  });

  return promise;
  
};

premium.Colour = async (bot, server_id) => {
  let promise = new Promise(async resolve => {
    try {
      let isPremium = await premium.isPremium(bot, server_id);

      let colour;
      if(isPremium) {
        colour = '#F8F8FF';
      } else {
        colour = null;
      };

      return resolve(colour);

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error resolving server ID '+server_id+' for the premium colour',
          stack: e
        }
      });

    };

  });

  return promise;
}

premium.Add = async (bot, server_id, admin_id) => {
  let promise = new Promise(async resolve => {
    try {
      let addPremium = await bot.db.SERVER_PREMIUM.create( { id: server_id, ACTIVATED_BY: admin_id } );

      if(addPremium == null) {
        return resolve(false);
      } else {
        return resolve(true)
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error adding premium to server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;
}

premium.Remove = async (bot, server_id) => {
  let promise = new Promise(async resolve => {
    try {
      let removePremium = await bot.db.SERVER_PREMIUM.destroy( { where: { id: server_id } } );

      if(removePremium == null) {
        return resolve(false);
      } else {
        return resolve(true)
      };

    } catch(e) {

      return resolve({
        error: {
          message: 'There was an error removing premium from server ID '+server_id,
          stack: e
        }
      });

    };

  });

  return promise;
}