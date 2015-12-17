'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        '//api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.css',
        'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
        'public/lib/sidebar-v2/css/leaflet-sidebar.min.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/angular-notify/dist/angular-notify.min.css',
        'public/lib/ng-ckeditor/ng-ckeditor.css',
        'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.css',
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/jquery/dist/jquery.js',
        'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/underscore/underscore-min.js',
        'public/lib/modernizr/modernizr.js',
        '//api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/rangy/rangy-core.js',
        'public/lib/ng-ckeditor/libs/ckeditor/ckeditor.js',
        'public/lib/ng-ckeditor/ng-ckeditor.js',
        'public/lib/sidebar-v2/js/leaflet-sidebar.js',
        '//maps.stamen.com/js/tile.stamen.js?v1.3.0',
        'public/lib/classie/classie.js',
        'public/lib/masonry/dist/masonry.pkgd.js',
        'public/lib/moment/min/moment.js',
        'public/lib/xmlToJSON.js/lib/xmlToJSON.js',
        'public/lib/angular-notify/dist/angular-notify.js',
        'public/lib/ng-file-upload/ng-file-upload-shim.js',
        'public/lib/ng-file-upload/ng-file-upload.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
