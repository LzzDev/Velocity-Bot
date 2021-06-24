module.exports = function(emitter, bot, config) {
  bot.on('guildMemberAdd', async member => {
    let GUILD_ID = member.guild.id;
    let USER_ID = member.user.id;
    let USER_TAG = member.user.tag;
  
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