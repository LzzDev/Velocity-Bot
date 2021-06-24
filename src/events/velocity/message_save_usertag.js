module.exports = function(emitter, bot, config) {
  bot.on('message', async message => {
    if(message.author.bot == true) return;
    if(message.channel.type == 'dm') return;
    
    let GUILD_ID = message.guild.id;
    let USER_ID = message.author.id;
    let USER_TAG = message.author.tag;
  
    let findUser = await bot.db.USER_XP.findOne({
      where: {
        id: USER_ID,
        SERVER_ID: GUILD_ID
      }
    });
  
    if(findUser) {
      await bot.db.USER_XP.update({
        USER_TAG: USER_TAG,
      }, { where: { id: USER_ID, SERVER_ID: GUILD_ID } });
    };
  });
};

module.exports.config = {
  disabled: false
};