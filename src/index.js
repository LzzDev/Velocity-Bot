process.env.NODE_ENV = process.platform == 'linux' ? 'production' : 'development'

// Modules
const Sequelize = require('sequelize');
const { Client, Intents, Permissions } = require('discord.js');
const config = {
    bot: require('./config/bot.json'),
    database: require('./config/database.json'),
    emotes: require('./config/emotes.json'),
    blist: require('./config/blist.json')
};

// Custom modules
const database = require('../lib/modules/database.js'),
    intervals = require('../lib/modules/intervals.js'),
    client = require('../lib/modules/client.js');

// Bot
const intents = new Intents();
intents.add(
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_PRESENCES'
);

const clientOptions = {
    ws: { intents }
};
const bot = new Client( clientOptions );

intervals.setupIntervals(bot);

// Events
const eventEmitter = require('events'),
    emitter = new eventEmitter();
require( './events/event_loader.js' )( emitter, bot, config );

// DataBase
config.database = config.database[ process.env.NODE_ENV ];
bot.db = new Sequelize(config.database['database'], config.database['username'], config.database['password'], {
    host: config.database['options'].host,
    port: config.database['options'].port,
    dialect: config.database['options'].dialect,
    logging: false,
    define: {
        freezeTableName: config.database['options'].define['freezeTableName']
    }
});
database.setupTables(bot.db);
database.syncDB(bot.db);

// Socket
const socketURL = process.env.NODE_ENV == 'development' ? 'http://localhost:8080' : 'https://localhost:443';
const io = require( 'socket.io-client' ).connect( socketURL, {
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    auth: {
        token: config.bot.socketToken
    }
} );

io.on( 'connect', () => console.log( '[io] Connected' ) );

io.on( 'message', data => console.log( data ) )

const { setPrefix } = require( '../lib/modules/configs.js' );
io.on( 'prefixUpdated', async ( newPrefix, guildID ) => {
    console.log( '[io] New prefix from website:', '\'' + newPrefix + '\'', guildID );
    try {
        let setGuildPrefix = await setPrefix( bot, guildID, newPrefix );
        if(setGuildPrefix.hasOwnProperty('error')) {
            console.log( '[io:error:prefixUpdated]', setGuildPrefix.error.message );
        };
    } catch ( e ) {
        console.log( '[io:error:prefixUpdated]', e.message );
    };
} );

io.on( 'memberHasManagePermsCheck', ( memberID, guildID ) => {
    let hasPerms = false;
    let existingGuild = false;
    let existingMember = false;

    let guild = bot.guilds.cache.find( g => g.id == guildID );

    if ( guild ) {
        existingGuild = true;

        let member = guild.members.cache.find( u => u.id == memberID );

        if ( member ) {
            existingMember = true;

            let permissions = new Permissions( member.permissions ).toArray();
            hasPerms = permissions.includes( 'MANAGE_GUILD' );
        };
    };

    io.emit( 'memberHasManagePerms-cb', hasPerms, memberID, guildID, existingGuild, existingMember );
} );

const { isPremium } = require( '../lib/modules/premium.js' );
io.on( 'guildHasPremiumCheck', async guildID => {
    let hasPremium = false;

    try {
        let isPremiumGuild = await isPremium( bot, guildID );
        if ( isPremiumGuild.hasOwnProperty( 'error' ) ) {
            console.log( '[io:error:guildHasPremiumCheck]', isPremiumGuild.error.message );
        } else {
            hasPremium = isPremiumGuild;
        };
    } catch ( e ) {
        console.log( '[io:error:guildHasPremiumCheck]', e.message );
    };

    io.emit( 'guildHasPremium-cb', hasPremium, guildID );
} );

const { getConfig } = require( '../lib/modules/configs.js' );
io.on( 'guildGetSettingsCheck', async guildID => {
    let serverSettings = {};

    try {
        let getServerConfig = await getConfig( bot, guildID );
        if ( getServerConfig.hasOwnProperty( 'error' ) ) {
            console.log( '[io:error:guildGetSettingsCheck]', getServerConfig.error.message );
        } else {
            serverSettings = getServerConfig;
        };
    } catch ( e ) {
        console.log( '[io:error:guildGetSettingsCheck]', e.message );
    };

    io.emit( 'guildGetSettings-cb', JSON.stringify( serverSettings ), guildID );
} );


bot.io = io;
bot.socket = io;



// Login
client.login(bot, config.bot[ process.env.NODE_ENV + '_TOKEN' ], emitter);