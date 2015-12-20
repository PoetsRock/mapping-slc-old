'use strict';

var defaultEnvConfig = require('./default'),
    bodyParser = require('body-parser'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

  console.log('path::::::CONFIG MY WIG:::::--- env dev\n', path);
  console.log('config::::::CONFIG MY WIG::::: --- env dev\n', config);
  console.log('config::::::CONFIG MY WIG::::: --- process.env   process.env   process.env\n', process.env);

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

  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/v1/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/v1/auth/google/callback'
  },
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
  },

  alchemyApi: {
    alchemyKey: process.env.ALCHEMY_KEY,
    callbackUrl: '/api/v1/auth/alchemy/callback'
  },
  aws: {
    awsAccessKey: process.env.AWS_ACCESS_KEY,
    awsSecretKey: process.env.AWS_SECRET_KEY,
    s3Id: process.env.S3_ID,
    s3Secret: process.env.S3_SECRET,
    callbackUrl: '/api/v1/auth/s3/callback'
  },
  census: {
    CENSUS_KEY: process.env.CENSUS_KEY,
    callbackUrl: '/api/v1/auth/census/callback'
  },
  googleAnalytics: {
    googleAnalyticsID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    callbackUrl: '/api/v1/auth/google-analytics/callback'
  },
  here: {
    HERE_KEY: process.env.HERE_KEY,
    HERE_SECRET: process.env.HERE_SECRET,
    callbackUrl: '/api/v1/auth/here/callback'
  },
  mapbox: {
    MAPBOX_KEY: process.env.MAPBOX_KEY,
    MAPBOX_SECRET: process.env.MAPBOX_SECRET,
    callbackUrl: '/api/v1/auth/mapbox/callback'
  }
  }
};
