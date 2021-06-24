const Sequelize = require('sequelize');
const moment = require('moment');

const database = module.exports;
database.setupTables = function(db) {
  // VELOCITY_SERVER_BLACKLISTS
  db.SERVER_BLACKLISTS = db.define('VELOCITY_SERVER_BLACKLISTS', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    BLACKLISTED_BY: Sequelize.STRING
  });

  // VELOCITY_SERVER_CONFIGS
  db.SERVER_CONFIGS = db.define('VELOCITY_SERVER_CONFIGS', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    PREFIX: Sequelize.STRING,
    LEVEL_UP_MESSAGE_ENABLED: Sequelize.STRING,
    LEVEL_UP_MESSAGE_TYPE: Sequelize.STRING,
    LEVEL_UP_MESSAGE: Sequelize.STRING
  });

  // VELOCITY_SERVER_PREMIUM
  db.SERVER_PREMIUM = db.define('VELOCITY_SERVER_PREMIUM', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    ACTIVATED_BY: Sequelize.STRING
  });

  // VELOCITY_SERVER_REWARD_ROLES
  db.SERVER_REWARD_ROLES = db.define('VELOCITY_SERVER_REWARD_ROLES', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    ROLE_ID: Sequelize.STRING,
    AWARD_AT_LEVEL: Sequelize.STRING
  });

  // VELOCITY_USER_BLACKLISTS
  db.USER_BLACKLISTS = db.define('VELOCITY_USER_BLACKLISTS', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    BLACKLISTED_BY: Sequelize.STRING
  });

  // VELOCITY_USER_XP
  db.USER_XP = db.define('VELOCITY_USER_XP', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    USER_TAG: Sequelize.STRING,
    SERVER_ID: Sequelize.STRING,
    TOTAL_XP_EARNED: Sequelize.INTEGER,
    LEVEL_XP: Sequelize.INTEGER,
    LEVEL: Sequelize.INTEGER
  });

  // VELOCITY_SERVER_STATIC_LEADERBOARD
  db.SERVER_STATIC_LEADERBOARD = db.define('VELOCITY_SERVER_STATIC_LEADERBOARD', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    STATIC_LEADERBOARD_CHANNEL: Sequelize.STRING,
    MESSAGE_ID: Sequelize.STRING,
    MESSAGE_COUNT: Sequelize.INTEGER
  });

  // VELOCITY_USER_CONFIGS
  db.USER_CONFIGS = db.define('VELOCITY_USER_CONFIGS', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    RANK_CARD_IMAGE: Sequelize.STRING
  });

  // VELOCITY_USER_SUGGESTIONS
  db.USER_SUGGESTIONS = db.define('VELOCITY_USER_SUGGESTIONS', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    userID: Sequelize.STRING,
    suggestionText: Sequelize.STRING
  });

  // VELOCITY_STAFF
  db.STAFF = db.define('VELOCITY_STAFF', {
    id: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true
    },
    avatarURL: Sequelize.STRING,
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    level: Sequelize.STRING
  });

};

database.syncDB = function(db) {
  // SERVER_BLACKLISTS
  db.SERVER_BLACKLISTS.sync();

  // SERVER_CONFIGS
  db.SERVER_CONFIGS.sync();

  // SERVER_PREMIUM
  db.SERVER_PREMIUM.sync();

  // SERVER_REWARD_ROLES
  db.SERVER_REWARD_ROLES.sync();

  // USER_BLACKLISTS
  db.USER_BLACKLISTS.sync();

  // USER_XP
  db.USER_XP.sync();
  
  // STAFF
  db.STAFF.sync();

  // DATABASE
  db.sync();
};