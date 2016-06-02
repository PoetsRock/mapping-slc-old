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
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/angular-notify/dist/angular-notify.css',
        'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css',
        'public/lib/mslc/angular-froala/src/css/froala_editor.min.css',
        'public/lib/mslc/angular-froala/src/css/froala_style.min.css',

        //load css for plugins for Froala text editor
        'public/lib/mslc/angular-froala/src/css/plugins/code_view.css',
        'public/lib/mslc/angular-froala/src/css/plugins/colors.css',
        'public/lib/mslc/angular-froala/src/css/plugins/draggable.min.css',
        'public/lib/mslc/angular-froala/src/css/plugins/emoticons.css',
        'public/lib/mslc/angular-froala/src/css/plugins/fullscreen.css',
        'public/lib/mslc/angular-froala/src/css/plugins/image_manager.css',
        'public/lib/mslc/angular-froala/src/css/plugins/image.css',
        'public/lib/mslc/angular-froala/src/css/plugins/line_breaker.css',
        'public/lib/mslc/angular-froala/src/css/plugins/table.css',
        'public/lib/mslc/angular-froala/src/css/plugins/video.css'


      ],
      js: [
        'public/lib/jquery/dist/jquery.js',
        'public/lib/jquery-migrate/jquery-migrate.min.js',
        'public/lib/modernizr/modernizr.js',
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
        'public/lib/angular-notify/dist/angular-notify.js',
        '//api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/rangy/rangy-core.js',
        'public/lib/angular-local-storage/dist/angular-local-storage.min.js',
        'public/lib/mslc/angular-froala/src/js/froala_editor.min.js',
        'public/lib/classie/classie.js',
        'public/lib/moment/min/moment.js',
        'public/lib/xmlToJSON.js/lib/xmlToJSON.js',
        'public/lib/ng-file-upload/ng-file-upload-shim.js',
        'public/lib/ng-file-upload/ng-file-upload.js',

        //load plugins for Froala text editor
        'public/lib/mslc/angular-froala/src/js/plugins/align.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/char_counter.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/code_beautifier.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/code_view.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/colors.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/emoticons.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/entities.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/font_family.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/font_size.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/fullscreen.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/image.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/image_manager.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/inline_style.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/line_breaker.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/link.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/lists.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/paragraph_format.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/paragraph_style.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/quote.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/save.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/table.min.js',
        'public/lib/mslc/angular-froala/src/js/plugins/video.min.js'

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
      'modules/*/client/directives/views/**/*.html'
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
