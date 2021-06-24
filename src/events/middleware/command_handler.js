const moment = require('moment');
const fs = require('fs');

module.exports = function(emitter, bot, config) {
  let command_folder = './src/bot_commands/';
  fs.readdir(command_folder, (err, files) => {
    if(err) return console.log('Error fs.readdir with commands folder: ' + err);
  
    files.forEach(file => {
      if(!file.endsWith('.js')) return;
  
      let command = {
        cmd: require('../../.'+command_folder+file),
        name: file.split('.')[0],
        aliases: require('../../.'+command_folder+file).config['aliases']
      };
  
      bot.commands.set(command.name, command.cmd);
  
      command.aliases.forEach(alias => {
        bot.command_aliases.set(alias, command.name)
      });
  
    });
  
  });
};

module.exports.config = {
  disabled: false
}