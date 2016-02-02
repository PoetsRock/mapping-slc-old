'use strict';

module.exports = {
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem'
  },

  //port: process.env.PORT || 8443,
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
  FACEBOOK_ID: process.env.FACEBOOK_ID || '319019724936363',
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '3ebfd75fff26823c6ab3f462c7060af0',
  FACEBOOK_CALLBACK_URL: '/api/v1/auth/facebook/callback',

  TWITTER_KEY: process.env.TWITTER_KEY || '8CcbaDkZ6P5U4AsCyDFpqI2sI',
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'pNt4bKHblud2TmbqGElP8LkLC9PvyjSa9hdLhk35NmTD9BKzfc',
  TWITTER_CALLBACK_URL: '/api/v1/auth/twitter/callback',

  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    CALLBACK_URL: '/api/v1/auth/github/callback'
  },

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'DyCpAJnbwQ0p0jbAZSpSg0dzPpvE',
  GOOGLE_SERVER_KEY: process.env.GOOGLE_SERVER_KEY || 'AIzaSyBZ63pS3QFjYlXuaNwPUTvcYdM-SGRmeJ0',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'PY2QWsCLXHVr5bTAEd_w92sI',
  GOOGLE_CALLBACK_URL: '/api/v1/auth/google/callback',

  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    CALLBACK_URL: '/api/v1/auth/linkedin/callback'
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

  MEMCACHIER_PASSWORD: process.env.MEMCACHIER_PASSWORD || 'c61b3e6ed7f6fdbd5566d84f38d1c6b7',
  MEMCACHIER_SERVERS: process.env.MEMCACHIER_SERVERS || 'mc5.dev.ec2.memcachier.com:11211',
  MEMCACHIER_USERNAME: process.env.MEMCACHIER_USERNAME || 'e3679d',

  PAPERTRAIL_API_TOKEN: process.env.PAPERTRAIL_API_TOKEN || 'GN3eyvmtzNGEQ5qULgPT',
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    CALLBACK_URL: '/api/v1/auth/paypal/callback',
    sandbox: false
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

  ALCHEMY_KEY: process.env.ALCHEMY_KEY || '9eb2296b11f66a08cb20ef6771bbe32b523a0840',
  ALCHEMY_CALLBACK_URL: '/api/v1/auth/alchemy/callback',

  S3_ID: process.env.S3_ID || 'AKIAJMZSYDXTHOHLVKVQ',
  S3_SECRET: process.env.S3_SECRET || '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',
  S3_BUCKET: process.env.S3_BUCKET || 'MAPPING-SLC-FILE-UPLOAD',
  S3_CALLBACK_URL: '/api/v1/auth/s3/callback',


  VIMEO_KEY: process.env.VIMEO_KEY || '6565bb005d7bffac18d89cbc4ef57af1bccde906',
  VIMEO_SECRET: process.env.VIMEO_SECRET || 'V7h0cZTU0VqBDjYdnAoBmuJb1/XoQzPQJ09NB9uSit6M8LJnt10bDwO7EQFbs9RbMM2Yruo/UZEeVSuG7dMNZW+W+950+Iny/31V5AJ9pokT6Gezzto3R8qnp0mO6NTs',
  VIMEO_TOKEN: process.env.VIMEO_TOKEN || 'a72958bf1f855bd7c58f3a354953c183',

  FRONT_END: {
    CENSUS_KEY: process.env.CENSUS_KEY || '4d396163ae90829a66916a08b3af462608c87316',
    CENSUS_CALLBACK_URL: '/api/v1/auth/census/callback',
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    GOOGLE_ANALYTICS_CALLBACK_URL: '/api/v1/auth/google-analytics/callback',
    HERE_KEY: process.env.HERE_KEY || 'p2ylB3rWtlPf8qVLBeCs',
    HERE_SECRET: process.env.HERE_SECRET || 'lQ16v8NyFSQ00RpaH3CMMg',
    HERE_CALLBACK_URL: '/api/v1/auth/here/callback',
    MAPBOX_KEY: process.env.MAPBOX_KEY || 'poetsrock.map-55znsh8b',
    MAPBOX_SECRET: process.env.MAPBOX_SECRET || 'pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw',
    MAPBOX_CALLBACK_URL: '/api/v1/auth/mapbox/callback',
    SOUND_CLOUD_KEY: process.env.SOUND_CLOUD_KEY || '30373b188823a02f3f389c7dcd99b7d2',
    SOUND_CLOUD_SECRET: process.env.SOUND_CLOUD_SECRET || '80b00226764d5c2b942a88628b2964d1'

  }

};
