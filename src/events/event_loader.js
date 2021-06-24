const fs = require('fs');
const moment = require('moment');

module.exports = function(emitter, bot, config) {
  fs.readdir('./src/events', (err, files) => {
    if(err) return console.log('Error fs.readdir with folder \'./src/events\'. ' + err);

    files.forEach(file => {
      fs.readdir('./src/events/'+file, (error, files) => {
        if(file.endsWith('.js')) return;
        if(error) return console.log('Error fs.readdir with folder \'./src/events/' + file + '\'. ' + err);

        files.forEach(fle => {
          if(!fle.endsWith('.js')) return;

          const event = require('../events/'+file+'/'+fle);
          if(event.config && event.config.hasOwnProperty('disabled') && event.config.disabled == true) return;

          try {
            if (typeof event == 'function') {
              event(emitter, bot, config);
            };
          } catch(e) {
            console.log('Error attempting to load event \'../src/events/'+file+'/'+fle+'\'. '+e);
          };

        });

      });

    });

  });

};