'use strict';

var   keys = require('../../modules/users/server/config/private/keys.js'),
      defaultEnvConfig = require('./default'),
      bodyParser = require('body-parser'),
      path = require('path'),
      config = require(path.resolve('./config/config'));

module.exports = {
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem'
  },

  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
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
    format: 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false
        }
      }
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || keys.facebookKey,
    clientSecret: process.env.FACEBOOK_SECRET || keys.facebookSecret,
    callbackURL: '/api/v1/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || keys.twitterKey,
    clientSecret: process.env.TWITTER_SECRET || keys.twitterSecret,
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
  aws: {
    s3Id: process.env.S3_ID || keys.s3Id,
    s3Secret: process.env.S3_SECRET || keys.s3Secret,
    callbackUrl: '/api/v1/auth/s3/callback'
  },
  alchemyApi: {
    alchemyKey: process.env.ALCHEMY_ID || keys.alchemyKey,
    callbackUrl: '/api/v1/auth/alchemy/callback'
  },
  census: {
    censusKey: process.env.CENSUS_KEY,
    callbackUrl: '/api/v1/auth/census/callback'
  },
  googleAnalytics: {
    googleAnalyticsID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    callbackUrl: '/api/v1/auth/google-analytics/callback'
  },
  here: {
    hereKey: process.env.HERE_KEY,
    hereSecret: process.env.HERE_SECRET,
    callbackUrl: '/api/v1/auth/here/callback'
  },
  mapbox: {
    MAPBOX_KEY: 'pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw',
    MAPBOX_SECRET: 'poetsrock.map-55znsh8b',
    callbackUrl: '/api/v1/auth/mapbox/callback'
  },

  livereload: true,
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
  }
};
