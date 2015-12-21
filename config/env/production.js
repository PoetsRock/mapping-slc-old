'use strict';

var defaultEnvConfig = require('./default'),
    bodyParser = require('body-parser'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

module.exports = {
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem'
  },
  port: process.env.PORT || 8443,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
        fileName: process.env.LOG_FILE || 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: process.env.LOG_ROTATING_ACTIVE === 'true' ? true : false, // activate to use rotating logs 
          fileName: process.env.LOG_ROTATING_FILE || 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: process.env.LOG_ROTATING_FREQUENCY || 'daily',
          verbose: process.env.LOG_ROTATING_VERBOSE === 'true' ? true : false
        }
      }
    }
  },

  FACEBOOK_ID: process.env.FACEBOOK_ID || 'CONSUMER_KEY',
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'CONSUMER_KEY',
  FACEBOOK_CALLBACK_URL: '/api/v1/auth/facebook/callback',

  TWITTER_KEY: process.env.TWITTER_KEY,
  TWITTER_SECRET: process.env.TWITTER_SECRET,
  TWITTER_CALLBACK_URL: '/api/v1/auth/twitter/callback',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SERVER_KEY: process.env.GOOGLE_SERVER_KEY,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  GOOGLE_CALLBACK_URL: '/api/v1/auth/google/callback',

  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/v1/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/v1/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/v1/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },

seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,

    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  },


  ALCHEMY_KEY: process.env.ALCHEMY_KEY,
  ALCHEMY_CALLBACK_URL: '/api/v1/auth/alchemy/callback',

  S3_ID: process.env.S3_ID,
  S3_SECRET: process.env.S3_SECRET,
  S3_BUCKET: process.env.S3_BUCKET || 'MAPPING-SLC-FILE-UPLOAD',
  S3_CALLBACK_URL: '/api/v1/auth/s3/callback',


  VIMEO_KEY: process.env.VIMEO_KEY,
  VIMEO_SECRET: process.env.VIMEO_SECRET,
  VIMEO_TOKEN: process.env.VIMEO_TOKEN,

  FRONT_END: {
    CENSUS_KEY: process.env.CENSUS_KEY,
    CENSUS_CALLBACK_URL: '/api/v1/auth/census/callback',
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    GOOGLE_ANALYTICS_CALLBACK_URL: '/api/v1/auth/google-analytics/callback',
    HERE_KEY: process.env.HERE_KEY,
    HERE_SECRET: process.env.HERE_SECRET,
    HERE_CALLBACK_URL: '/api/v1/auth/here/callback',
    MAPBOX_KEY: process.env.MAPBOX_KEY,
    MAPBOX_SECRET: process.env.MAPBOX_SECRET,
    MAPBOX_CALLBACK_URL: '/api/v1/auth/mapbox/callback',
    SOUND_CLOUD_KEY: process.env.SOUND_CLOUD_KEY,
    SOUND_CLOUD_SECRET: process.env.SOUND_CLOUD_SECRET

  }
};
