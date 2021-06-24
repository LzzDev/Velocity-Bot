const childProcess = require('child_process');
const { MessageEmbed } = require('discord.js');

const humanizeMs = require('humanize-duration');

module.exports.run = async (bot, message, args) => {
    const execCommand = args // my args: const args = message.content.slice(prefix.length).split(' ');
        .filter(arg => arg != '')
        .join(' ');
    
    const outputEmbed = new MessageEmbed()
        .setColor('#F8F8FF')
        .setDescription('');
    
    const wrap = (...str) => ['```prolog', ...str, '```'].join('\n');
    const append = (elements) => elements.map(el => outputEmbed.description += el + '\n');
    
    const timeBeforeExec = Date.now();
    const execCallback = (error, output, stdError) => {
        const timeAfterExec = Date.now();
        const execTime = timeAfterExec - timeBeforeExec;

        outputEmbed.setFooter('Executed in ' + (humanizeMs(execTime)) + ' (' + execTime + 'ms)');

        if (output) append([
            '> **Output:**',
            wrap(output)
        ]);

        if (stdError) {
            const smallError = stdError
                .toString()
                .split('\n')[0];
            
            append([
                '> **Error:**',
                '`' + ((smallError ? smallError : 'Something went wrong...').replace('Error: ', '')) + '`',
                wrap(stdError)
            ]);
        };

        message.channel.send(outputEmbed);
    };
    
    childProcess.exec(execCommand, execCallback);
};

module.exports.config = {
    name: 'exec',
	usage() {
        return [
            this.name+' [string]'
        ]
    },
    examples() {
        return []
    },
    description: 'Executes stuff as console',
	aliases: [],
    permission: 4,
    isPremiumCommand: false,
    commandCategory: 'developer'
};