const moment = require('moment');

const client = module.exports;
client.login = function(bot, token, emitter) {
  try {
    bot.login(token);
  } catch(e) {
    console.log('Error logging in: ' + e.stack);
  };
};

client.humanizeMS = ms => {
  let dM = ms % 86400000,
      hM = ms % 3600000,
      mM = ms % 60000;

  let d = Math.floor( ms / 86400000 ),
      h = Math.floor( dM / 3600000 ),
      m = Math.floor( hM / 60000 ),
      s = Math.floor( mM / 1000 );

  let sT = [
      d + 'd',
      h + 'h',
      m + 'm',
      s + 's'
  ];

  return sT.filter( e => !e.match( /0./ ) ).join( ' ' );
};