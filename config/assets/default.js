'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
        '//api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.css',
        'public/lib/angular-material/angular-material.css',
        'public/lib/angular-material/angular-material.layouts.min.css',
        'modules/redactor/redactor/redactor.css',
        'public/lib/sidebar-v2/css/leaflet-sidebar.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/angular-notify/dist/angular-notify.css',
        'public/lib/ng-ckeditor/ng-ckeditor.css',
        'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css',
        'public/lib/c3/c3.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.js',
        'public/lib/jquery-migrate/jquery-migrate.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-route/angular-route.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/bootstrap/dist/js/bootstrap.js',
        'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
        'public/lib/angular-material/angular-material.min.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/modernizr/modernizr.js',
        '//api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/rangy/rangy-core.js',
        'public/lib/d3/d3.js',
        'public/lib/ng-ckeditor/libs/ckeditor/ckeditor.js',
        'public/lib/ng-ckeditor/ng-ckeditor.js',
        'public/lib/sidebar-v2/js/leaflet-sidebar.js',
        'public/lib/classie/classie.js',
        'public/lib/masonry/dist/masonry.pkgd.js',
        'public/lib/moment/min/moment.js',
        'public/lib/c3/c3.js',
        'public/lib/xmlToJSON.js/lib/xmlToJSON.js',
        'public/lib/angular-notify/dist/angular-notify.js',
        'public/lib/ng-file-upload/ng-file-upload-shim.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'modules/redactor/client/redactor.js',
        'modules/redactor/client/angular-redactor-2.js'

      ],
      tests: [
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-material/angular-material-mocks.js'
      ]
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
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: [
      'modules/*/client/views/**/*.html',
      'modules/**/*/directives/views/**/*.html'
    ],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
