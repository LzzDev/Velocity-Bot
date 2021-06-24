const intervals = module.exports;
intervals.setupIntervals = function(bot) {
  setInterval(() => {
    bot.command_cooldown = new Set();
  }, 5000);

  setInterval(() => {
    bot.command_cooldown_premium = new Set();
  }, 2000);

  setInterval(() => {
    bot.xp_cooldown = new Set();
  }, 120000);

};