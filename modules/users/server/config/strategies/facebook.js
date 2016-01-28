'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.FACEBOOK_ID,
      clientSecret: config.FACEBOOK_SECRET,
      callbackURL: config.FACEBOOK_CALLBACK_URL,
      //profileFields: ['id', 'name', 'displayName', 'emails', 'photos', 'timezone', 'relationship_status', 'gender', 'about', 'bio'],
    profileFields: ['id', 'name', 'displayName', 'emails', 'photos', 'timezone', 'relationship_status', 'location', 'hometown', 'gender', 'birthday', 'about', 'bio', 'cover'],
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        gender: profile.gender,
        about: profile.about,
        hometown: profile.hometown,
        email: profile.emails ? profile.emails[0].value : undefined,
        username: profile.username || generateUsername(profile),
        profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
        provider: 'facebook',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);

      function generateUsername(profile) {
        var username = '';

        if (profile.emails) {
          username = profile.emails[0].value.split('@')[0];
        } else if (profile.name) {
          username = profile.name.givenName[0] + profile.name.familyName;
        }

        return username.toLowerCase() || undefined;
      }
    }
  ));
};
