const levels = require('../../lib/modules/levels.js');

const strip = row => row.dataValues

module.exports.run = async ( bot, message, args, config, emitter ) => {
	let inputArgs = arg( { '--author': String }, args );
	
    let AUTHOR_ID = config.bot.DEVS.includes( message.author.id ) && inputArgs.hasOwnProperty( '--author' ) ? inputArgs[ '--author' ] || message.author.id : message.author.id;
    
    let ownedPremiumGuilds = [];

    let premiumGuilds = await bot.db.SERVER_PREMIUM.findAll();
    for ( let i = 0; i < premiumGuilds.length; i++ ) {
        const premGuild = strip( premiumGuilds[ i ] );

        const guild = bot.guilds.cache.find( g => g.id == premGuild.id )
        const isValidGuild = guild ? true : false;

        if ( !isValidGuild ) continue;
        if ( guild.owner.id != AUTHOR_ID ) continue;

        ownedPremiumGuilds.push( guild.id );
    };
    
	if ( !config.bot.DEVS.includes( message.author.id ) && 1 > ownedPremiumGuilds.length ) return message.channel.send( config.emotes.velocityCross + ' **- You need to own at least 1 premium guild to be able to use this command**' );
	
	if ( args[ 0 ] && args[ 0 ].toLowerCase() == 'reset' ) {
		try {
			await bot.db.USER_CONFIGS.destroy( { where: { id: AUTHOR_ID } } );

			message.channel.send( config.emotes.velocityTick + ' **- You have reset your rank card background**' );
		} catch ( e ) {
            return message.channel.send( config.emotes.velocityCross + ' **- There was an error resetting your background image for your rank card, please report the following error to the Velocity support server: \`' + e.message + '\`**' );
		};
		return;
	};

    if ( !levels.validURL( args[ 0 ] ) ) return message.channel.send( config.emotes.velocityCross + ' **- You need to provide a valid URL to an image to set as your rank card background**' );

    let getUserConfig = await bot.db.USER_CONFIGS.findOne( { where: { id: AUTHOR_ID } } );
	let user = { id: AUTHOR_ID, RANK_CARD_IMAGE: args[ 0 ] };
    if ( !getUserConfig ) {
        try {
            await bot.db.USER_CONFIGS.create( user );
            
            message.channel.send( config.emotes.velocityTick + ' **- Your background image for your rank card has been saved**' );
        } catch ( e ) {
            return message.channel.send( config.emotes.velocityCross + ' **- There was an error saving your background image for your rank card, please report the following error to the Velocity support server: \`' + e.message + '\`**' );
        };
    } else {
        try {
            await bot.db.USER_CONFIGS.update( user, { where: { id: AUTHOR_ID } } );
            
            message.channel.send( config.emotes.velocityTick + ' **- Your background image for your rank card has been updated**' );
        } catch ( e ) {
            return message.channel.send( config.emotes.velocityCross + ' **- There was an error updating your background image for your rank card, please report the following error to the Velocity support server: \`' + e.message + '\`**' );
        };
	};
	
};

module.exports.config = {
    name: 'rankimage',
    usage() {
        return [
            this.name + ' [image url]',
            this.name + ' [reset]'
        ]
    },
    examples() {
        return [
            this.name + ' https://example.com/image.png',
            this.name + ' reset'
        ]
    },
    description: 'Change/Display your rank card\'s background image',
    aliases: [
        'editimage'
	],
	permission: 0,
	isPremiumCommand: false,
	commandCategory: 'management'
};


const flagSymbol = Symbol('arg flag');

function arg( opts, argv = process.argv.slice( 2 ) ) {
	if ( !opts ) throw new Error( 'Argument specification object is required' );

	const result = { _: [] };

	const aliases = {};
	const handlers = {};

	for ( const key of Object.keys( opts ) ) {
		if ( !key ) throw new TypeError( 'Argument key cannot be an empty string' );

		if ( key[ 0 ] !== '-' ) throw new TypeError( `Argument key must start with '-' but found: '${ key }'` );

		if (key.length === 1) throw new TypeError( `Argument key must have a name; singular '-' keys are not allowed: ${ key }` );

		if ( typeof opts[ key ] === 'string' ) {
			aliases[ key ] = opts[ key ];
			continue;
		};

		let type = opts[ key ];
		let isFlag = false;

		if ( Array.isArray( type ) && type.length === 1 && typeof type[ 0 ] === 'function' ) {
            const [ fn ] = type;
            
			type = ( value, name, prev = [] ) => {
				prev.push( fn( value, name, prev[ prev.length - 1 ] ) );
				return prev;
            };
            
			isFlag = fn === Boolean || fn[ flagSymbol ] === true;
		} else if ( typeof type === 'function' ) {
			isFlag = type === Boolean || type[ flagSymbol ] === true;
		} else {
			throw new TypeError( `Type missing or not a function or valid array type: ${ key }` );
		};

		if ( key[ 1 ] !== '-' && key.length > 2 ) throw new TypeError( `Short argument keys (with a single hyphen) must have only one character: ${ key }` );

		handlers[ key ] = [ type, isFlag ];
	}

	for ( let i = 0, len = argv.length; i < len; i++ ) {
		const wholeArg = argv[ i ];

		if ( wholeArg === '--' ) {
			result._ = result._.concat( argv.slice( i + 1 ) );
			break;
		};

		if ( wholeArg.length > 1 && wholeArg[ 0 ] === '-' ) {
			/* eslint-disable operator-linebreak */
			const separatedArguments = ( wholeArg[ 1 ] === '-' || wholeArg.length === 2 )
				? [ wholeArg ]
				: wholeArg.slice( 1 ).split( '' ).map( a => `-${ a }` );
			/* eslint-enable operator-linebreak */

			for ( let j = 0; j < separatedArguments.length; j++ ) {
				const arg = separatedArguments[ j ];
				const [ originalArgName, argStr ] = arg[ 1 ] === '-' ? arg.split( /=(.*)/, 2 ) : [ arg, undefined ];

				let argName = originalArgName;
				while ( argName in aliases ) {
					argName = aliases[ argName ];
				};

				if ( !( argName in handlers ) ) {
                    result._.push( arg );
                    continue;
				};

				const [ type, isFlag ] = handlers[ argName ];

				if ( !isFlag && ( ( j + 1 ) < separatedArguments.length ) ) throw new TypeError( `Option requires argument (but was followed by another short argument): ${ originalArgName }` );

				if ( isFlag ) {
					result[ argName ] = type( true, argName, result[ argName ] );
				} else if ( argStr === undefined ) {
					if (
						argv.length < i + 2 ||
						(
							argv[ i + 1 ].length > 1 &&
							( argv[ i + 1 ][ 0 ] === '-' ) &&
							!(
								argv[ i + 1 ].match( /^-?\d*(\.(?=\d))?\d*$/ ) &&
								(
									type === Number ||
									// eslint-disable-next-line no-undef
									( typeof BigInt !== 'undefined' && type === BigInt )
								)
							)
						)
					) {
					    result[ argName ] = undefined;  
					};

					result[ argName ] = type( argv[ i + 1 ], argName, result[ argName ] );
					++i;
				} else {
					result[ argName ] = type( argStr, argName, result[ argName ] );
				};
			};
		} else {
			result._.push( wholeArg );
		};
	};

	return result;
};