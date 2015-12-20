'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  defaultAssets = require('./config/assets/default'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins({
    rename: {
      'gulp-angular-templatecache': 'templateCache'
    }
  }),
  path = require('path'),
  endOfLine = require('os').EOL;

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  //process.env.NODE_ENV = 'development';
  process.env.NODE_ENV = 'local-development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    ext: 'js,html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.livereload.listen();

  // Add watch rules
  gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.server.allJS).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.js).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.css).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.sass).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.less).on('change', plugins.livereload.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.server.gulpConfig, ['templatecache']);
    gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.livereload.changed);
  } else {
    gulp.watch(defaultAssets.server.gulpConfig);
    gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
  }
});

// JS minifying task
gulp.task('uglify', function () {
  var assets = _.union(
    defaultAssets.client.js,
    defaultAssets.client.templates
  );

  return gulp.src(assets)
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.concat('application.js'))
    .pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.concat('application.css'))
    .pipe(gulp.dest('public/dist'));
});


// Sass task
gulp.task('sass', function () {
  return gulp.src(defaultAssets.client.sass)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename(function (file) {
      file.dirname = file.dirname.replace(path.sep + 'scss', path.sep + 'css');
    }))
    .pipe(gulp.dest('./modules/'));
});

// Less task
gulp.task('less', function () {
  return gulp.src(defaultAssets.client.less)
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename(function (file) {
      file.dirname = file.dirname.replace(path.sep + 'less', path.sep + 'css');
    }))
    .pipe(gulp.dest('./modules/'));
});

// Angular template cache task
gulp.task('templatecache', function () {
  var re = new RegExp('\\' + path.sep + 'client\\' + path.sep, 'g');

  return gulp.src(defaultAssets.client.views)
    .pipe(plugins.templateCache('templates.js', {
      root: 'modules/',
      module: 'core',
      templateHeader: '(function () {' + endOfLine + '	\'use strict\';' + endOfLine + endOfLine + '	angular' + endOfLine + '		.module(\'<%= module %>\'<%= standalone %>)' + endOfLine + '		.run(templates);' + endOfLine + endOfLine + '	templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + '	function templates($templateCache) {' + endOfLine,
      templateBody: '		$templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
      templateFooter: '	}' + endOfLine + '})();' + endOfLine,
      transformUrl: function (url) {
        return url.replace(re, path.sep);
      }
    }))
    .pipe(gulp.dest('build'));
});

// Run the project in development mode
gulp.task('default', function (done) {
  runSequence('env:dev', ['nodemon', 'watch'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
  runSequence('env:dev', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project in debug mode
gulp.task('debug', function (done) {
  runSequence('env:dev', ['nodemon', 'watch'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build-no-mini', function (done) {
  runSequence('env:dev', ['uglify', 'cssmin'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence('templatecache', 'build-no-mini', 'env:prod', ['nodemon', 'watch'], done);
});


/**
 *  Heroku Buildpack for Node.js and gulp.js
 *
 * url: https://github.com/timdp/heroku-buildpack-nodejs-gulp
    - Set your Heroku app's buildpack URL to https://github.com/timdp/heroku-buildpack-nodejs-gulp.git
    Add a Gulp task called `heroku:production` that builds your app
    Serve your app using Express or whatever
**/
