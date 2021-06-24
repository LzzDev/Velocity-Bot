const { Client } = require('discord.js');

Client.prototype.__defineGetter__('id2', function() { return this.id + ' id2'; });

// Commands
Client.prototype.commands = new Map();
Client.prototype.command_aliases = new Map();

// Cooldowns
Client.prototype.xp_cooldown = new Set();
Client.prototype.command_cooldown = new Set();
Client.prototype.command_cooldown_premium = new Set();

// MS Converters
Client.prototype.ms = {
    length: ms => {
        let seconds = (ms / 1000).toFixed(0);
        let minutes = Math.floor(seconds / 60);
        let hours = '';

        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            hours = (hours >= 10) ? hours : '0' + hours;

            minutes = minutes - (hours * 60);
            minutes = (minutes >= 10) ? minutes : '0' + minutes;
        };

        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : '0' + seconds;

        if (hours != '') return hours + ':' + minutes + ':' + seconds;

        return minutes + ':' + seconds;
    },
    humanize: (ms, useMilli = false) => {
        function parseDuration(ms) {
            let remain = ms;
          
            let days = Math.floor(remain / (1000 * 60 * 60 * 24));
            remain = remain % (1000 * 60 * 60 * 24);
          
            let hours = Math.floor(remain / (1000 * 60 * 60));
            remain = remain % (1000 * 60 * 60);
          
            let minutes = Math.floor(remain / (1000 * 60));
            remain = remain % (1000 * 60);
          
            let seconds = Math.floor(remain / (1000));
            remain = remain % (1000);
          
            let milliseconds = remain;
          
            return {
                days,
                hours,
                minutes,
                seconds,
                milliseconds
            };
        };

        function formatTime(o, useMilli = false) {
            let parts = []
            if (o.days) {
              let ret = o.days + ' day'
              if (o.days !== 1) {
                ret += 's'
              }
              parts.push(ret)
            }
            if (o.hours) {
              let ret = o.hours + ' hour'
              if (o.hours !== 1) {
                ret += 's'
              }
              parts.push(ret)
            }
            if (o.minutes) {
              let ret = o.minutes + ' minute'
              if (o.minutes !== 1) {
                ret += 's'
              }
              parts.push(ret)
          
            }
            if (o.seconds) {
              let ret = o.seconds + ' second'
              if (o.seconds !== 1) {
                ret += 's'
              }
              parts.push(ret)
            }
            if (useMilli && o.milliseconds) {
              let ret = o.milliseconds + ' millisecond'
              if (o.milliseconds !== 1) {
                ret += 's'
              }
              parts.push(ret)
            }
            if (parts.length === 0) {
              return 'instantly'
            } else {
              return parts.join(' ')
            }
        };

        let time = parseDuration(ms);
        return formatTime(time, useMilli);
    }
};