/*==========================================================================
 Gulp for Drupal Gulpfile.js version 3.2.1 2016-09-16
 ===========================================================================*/
var
  gulp = require('gulp-help')(require('gulp')),
  config = require('./gulpconfig.json'),
  path = require('path');

var
  addsrc = require('gulp-add-src'), // Add files midstream
  autoprefixer = require('gulp-autoprefixer'),  // Adds prefixes to css files
  bower = require('gulp-bower'), // Install libraries via bower
  browserSync = require('browser-sync').create(), // Run synchronized server
  bytediff = require('gulp-bytediff'), // Size difference before and after alteration
  cache = require('gulp-cache'), // Cache stream
  checkDeps = require('gulp-check-deps'), // Check the dependencies
  compass = require('compass-importer'), // Add ability for compass mixins
  concat = require('gulp-concat'), // Concat files
  filter = require('gulp-filter'), // Filter stream
  gulpif = require('gulp-if'), // Conditional tasks
  gulpSequence = require('gulp-sequence'), // Run tasks in set sequence
  gzip = require('gulp-gzip'), // gZip CSS & JavaScript
  modernizr = require('gulp-modernizr'), // Create custom modernizr file
  nano = require('gulp-cssnano'), // Minifies css
  notify = require("gulp-notify"), // Adds notifications to tasks
  open = require('gulp-open'), // Opens url (from notification)
  order = require("gulp-order"), // Order files in a stream, used for bootstrap js files
  pa11y = require('gulp-pa11y'), // Pa11y accessibility audit
  parker = require('gulp-parker'), // Parker stylesheet analysis
  plumber = require('gulp-plumber'), // Error Handling
  postcss = require('gulp-postcss'), // PostCSS support for Gulp
  prompt = require('gulp-prompt'), // Get a prompt to configure tasks while running it
  rename = require("gulp-rename"), // Rename files
  sass = require('gulp-sass'), // Sass compiler
  sassLint = require('gulp-sass-lint'), // Lint SCSS for code consistency
  sizereport = require('gulp-sizereport'), // Create an sizereport for your project
  shell = require('gulp-shell'), // Run Shellcommands (used for pagespeedsinsight)
  sourcemaps = require('gulp-sourcemaps'), // Creates sourcemaps in css files
  Table = require('cli-table'), // Create tables in console
  uglify = require('gulp-uglify'), // Minifies javascript
  UglifyJS = require('uglify-js'), // Library to minify JavaScript files
	bulkSass = require('gulp-sass-glob-import'); // Enables @import folder functionality in Sass

var reload = browserSync.reload;

/*====================================================================================================
 =====================================================================================================*/

/*CSS------------------------------------------------------------------------------------------------*/
//SASS - Compile Sass, create sourcemaps, autoprefix and minify
gulp.task('sass', 'Compile Sass, create sourcemaps, autoprefix and minify.',[], function(){
  var onError = function(err) {
    notify.onError({
      title:    "Error in Sass",
      message:  "<%= error.message %>",
      sound:    "Beep"
    })(err);
    this.emit('end');
  };
  var filter_sourcemaps = filter(['**/*','!**/*.map'], {restore: true});
  var filter_exclude = filter(config.css.exclude, {restore: false});
  return gulp.src([config.locations.src.scsspath + '/' + '**/*.s+(a|c)ss', '!' + config.libraries.path.scss + '/**/*' ])
    .pipe(filter_exclude)
      .pipe(bulkSass())
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(config.css.sourcemaps.sourcemaps == true,sourcemaps.init({
      loadMaps: config.css.sourcemaps.loadmaps,
      identityMap: config.css.sourcemaps.identitymap,
      debug: config.css.sourcemaps.debug
    })))
    .pipe(gulpif(config.css.compass != true,sass()))
    .pipe(gulpif(config.css.compass == true,sass({ importer: compass }).on('error', sass.logError)))
    .pipe(autoprefixer({
      browsers: config.css.browsersupport,
      cascade: false
    }))
    .pipe(gulpif(config.css.sourcemaps.sourcemaps == true,sourcemaps.write(config.css.sourcemaps.location, {
      addComment: config.css.sourcemaps.addcomment,
      includeContent: config.css.sourcemaps.includeContent,
      sourceRoot: function(file) {
        return '../'.repeat(file.relative.split('\\').length) + 'src';
      },
      destPath: config.css.sourcemaps.destpath,
      sourceMappingURLPrefix: config.css.sourcemaps.sourcemappingurlprefix,
      debug: config.css.sourcemaps.debug,
      charset: config.css.sourcemaps.charset,
    })))
    .pipe(gulp.dest(config.locations.dist.csspath))
    .pipe(filter_sourcemaps)
    .pipe(gulpif(config.css.minify == true, bytediff.start()))
    .pipe(gulpif(config.css.minify == true, nano()))
    .pipe(gulpif(config.css.minify == true,rename(function (path) {
      path.basename += ".min";
    })))
    .pipe(gulpif(config.css.minify == true, gulp.dest(config.locations.dist.csspath)))
    .pipe(gulpif(config.css.minify == true, bytediff.stop()))
    .pipe(gulpif(config.css.gzip == true, bytediff.start()))
    .pipe(gulpif(config.css.gzip == true,gzip()))
    .pipe(gulpif(config.css.gzip == true, gulp.dest(config.locations.dist.csspath)))
    .pipe(gulpif(config.css.gzip == true, bytediff.stop()))
    .pipe(filter_sourcemaps.restore)
    .pipe(sizereport({
      gzip: true,
      '*': {
        'maxSize': config.quality.maxsize.css
      },
    }))
    .pipe(plumber.stop())
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(plumber())
    .pipe(notify({
      title: 'Sass Compiled',
      message: '<%= file.relative %>',
      onLast: true,
      wait: false
    }))
    .pipe(plumber.stop())
});

//SASSlinter validates your SASS
gulp.task('sasslint', 'validate your SASS', function() {
  return gulp.src([config.locations.src.scsspath + '/' + '**/*.s+(a|c)ss', '!' + config.libraries.path.scss + '/**/*'])
    .pipe(sassLint({
      options: {
      },
      config: config.css.linter.config
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

//Parker Stylesheet analysis
gulp.task('parker', 'Analyse your CSS files with parker', function() {
  return gulp.src([config.locations.src.scsspath + '/' + '**/*.s+(a|c)ss', '!' + config.libraries.path.scss + '/**/*'])
    .pipe(gulpif(config.css.compass != true,sass()))
    .pipe(gulpif(config.css.compass == true,sass({ importer: compass }).on('error', sass.logError)))
    .pipe(gulpif(config.css.parker.log == true,parker({
      file: config.css.parker.logname + '.md',
      title: 'Gulp Parker Test Report - ' + config.general.projectpath
    })))
    .pipe(gulpif(config.css.parker.log != true,parker()))
});

// Create Specificity Graph
gulp.task('specificity','Create a specificity graph for CSS', function() {
  return gulp.src('', {
    read: false
  })
    .pipe(shell([
      'specificity-graph ' + config.locations.dist.csspath + '*.css -o ' + config.css.specificitygraphlocation,
    ]))
    .pipe(notify({
      title: "Specificity Graph",
      message: "Graph Created",
      onLast: true
    }));
});

/*---------------------------------------------------------------------------------------------------*/

/*Browsersync-----------------------------------------------------------------------------------------*/
//Browsersync - Run server with syncronized screens on multiple devices
gulp.task('browsersync', 'Run server with syncronized screens on multiple devices.', ['sass'], function() {
  browserSync.init({
    open: config.browsersync.open,
    proxy: config.general.projectpath,
    logLevel: config.browsersync.loglevel,
    logFileChanges: config.browsersync.logfilechanges,
  });
  return gulp.src('./', {read: false})
    .pipe(plumber())
    .pipe(notify({
      title: "Browsersync Started",
      message: 'Click to launch browser',
      onLast: true,
      wait: true ,
      icon: path.join(__dirname, config.general.logopath),
    }))
    .pipe(plumber.stop());
});
//Share - Run browsersync server without syncronized actions, to share progress
gulp.task('share', 'Run server to share progress.', function() {
  browserSync.init({
    open: config.share.open,
    ghostMode: {
      clicks: config.share.clicks,
      forms: config.share.forms,
      scroll: config.share.scroll
    },
    port: config.share.port,
    proxy: config.general.projectpath,
  });
  return gulp.src('./', {read: false})
    .pipe(notify({
      title: "Server started",
      message: "Share server started on port: " + config.share.port,
      wait: false ,
    }));
});
/*---------------------------------------------------------------------------------------------------*/

/*Libraries------------------------------------------------------------------------------------------*/
//Install libraries via Bower, configure in bower.json
gulp.task('bower', 'Install libraries via Bower', function() {
  return bower({
    directory: './' + config.libraries.bower.path,
    interactive: config.libraries.bower.interactive,
    verbosity: config.libraries.bower.verbosity
  })
});

//Bootstrap - generate bootstrap javascript file, also uglified
gulp.task('bootstrapjs', 'Generate bootstrap javascript file, also uglified.', function () {
  const filter__sourcemaps = filter(['**/*.js', '!**/*.map']);
  return gulp.src([config.libraries.path.js + "/bootstrap/util.js"])
    .pipe(plumber())
    .pipe(gulpif(config.js.bootstrap.alertjs == true, (addsrc(config.libraries.path.js + "/bootstrap/alert.js"))))
    .pipe(gulpif(config.js.bootstrap.buttonjs == true, (addsrc(config.libraries.path.js + "/bootstrap/button.js"))))
    .pipe(gulpif(config.js.bootstrap.carouseljs == true, (addsrc(config.libraries.path.js + "/bootstrap/carousel.js"))))
    .pipe(gulpif(config.js.bootstrap.collapsejs == true, (addsrc(config.libraries.path.js + "/bootstrap/collapse.js"))))
    .pipe(gulpif(config.js.bootstrap.dropdownjs == true, (addsrc(config.libraries.path.js + "/bootstrap/dropdown.js"))))
    .pipe(gulpif(config.js.bootstrap.modaljs == true, (addsrc(config.libraries.path.js + "/bootstrap/modal.js"))))
    .pipe(gulpif(config.js.bootstrap.popoverjs == true, (addsrc(config.libraries.path.js + "/bootstrap/popover.js"))))
    .pipe(gulpif(config.js.bootstrap.scrollspyjs == true, (addsrc(config.libraries.path.js + "/bootstrap/scrollspy.js"))))
    .pipe(gulpif(config.js.bootstrap.tabjs == true, (addsrc(config.libraries.path.js + "/bootstrap/tab.js"))))
    .pipe(gulpif(config.js.bootstrap.tooltipjs == true, (addsrc(config.libraries.path.js + "/tether/tether.js"))))
    .pipe(gulpif(config.js.bootstrap.tooltipjs == true, (addsrc(config.libraries.path.js + "/bootstrap/tooltip.js"))))
    .pipe(filter__sourcemaps)
    .pipe(gulpif(config.js.sourcemaps.sourcemaps == true, sourcemaps.init({
      loadMaps: config.js.sourcemaps.loadmaps,
      identityMap: config.js.sourcemaps.identitymap,
      debug: config.js.sourcemaps.debug
    })))
    .pipe(order([
      "**/*/util.js",
      "**/*/alert.js",
      "**/*/button.js",
      "**/*/carousel.js",
      "**/*/collapse.js",
      "**/*/dropdown.js",
      "**/*/modal.js",
      "**/*/scrollspy.js",
      "**/*/tab.js",
      "**/*/tether.js",
      "**/*/tooltip.js",
      "**/*/popover.js"
    ], { base: './' }))
    .pipe(concat('bootstrap.js'))
    .pipe(gulpif(config.js.sourcemaps.sourcemaps == true, sourcemaps.write(config.js.sourcemaps.location, {
      addComment: config.js.sourcemaps.addcomment,
      includeContent: config.js.sourcemaps.includeContent,
      sourceRoot: function (file) {
        return '../'.repeat(file.relative.split('\\').length) + 'src';
      },
      destPath: config.js.sourcemaps.destpath,
      sourceMappingURLPrefix: config.js.sourcemaps.sourcemappingurlprefix,
      debug: config.js.sourcemaps.debug,
      charset: config.js.sourcemaps.charset,
    })))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.libraries.path.js))
    .pipe(sizereport({
      minifier: function (contents, filepath) {
        if (filepath.match(/\.min\./g)) {
          return contents
        }
        return UglifyJS.minify(contents, {fromString: true}).code;
      },
      gzip: true,
      '*': {
        'maxSize': config.quality.maxsize.js
      }
    }))
    .pipe(gulpif(config.js.minify == true, uglify()))
    .pipe(gulpif(config.js.minify == true, rename(function (path) {
      path.basename += ".min";
    })))
    .pipe(gulpif(config.js.minify == true, gulp.dest(config.libraries.path.js)))
    .pipe(gulpif(config.js.gzip == true, gzip()))
    .pipe(gulpif(config.js.gzip == true, gulp.dest(config.libraries.path.js)))
});

//Modernizr - Create modernizr file from SCSS selectors and Javascript, Also uglified the file
gulp.task('modernizr', 'Create modernizr file from SCSS selectors and Javascript, Also uglified the file.', function() {
  gulp.src([config.locations.src.jspath + '**/*.js', config.locations.src.scsspath + '/**/*.s+(a|c)ss', '!' + config.libraries.path.js + '**/*.js'])
    .pipe(modernizr({
      excludeTests: config.js.modernizr.alwaysexclude,
      options : config.js.modernizr.alwaysinclude,
    }))
    .pipe(gulp.dest(config.libraries.path.js))
    .pipe(sizereport({
      minifier: function (contents, filepath) {
        if (filepath.match(/\.min\./g)) {
          return contents
        }
        return UglifyJS.minify(contents, { fromString: true }).code;
      },
      gzip: true,
      '*': {
        'maxSize': config.quality.maxsize.js
      }
    }))
    .pipe(gulpif(config.js.minify == true,uglify()))
    .pipe(gulpif(config.js.minify == true,rename(function (path) {
      path.basename += ".min";
    })))
    .pipe(gulpif(config.js.minify == true,gulp.dest(config.libraries.path.js)))
    .pipe(gulpif(config.js.gzip == true,gzip()))
    .pipe(gulpif(config.js.gzip == true,gulp.dest(config.libraries.path.js)))
});

//JS - Building JavaScript Libraries, Modernizr and Bootstrap
gulp.task('jslibs', 'Building JavaScript Libraries, Modernizr and Bootstrap.', ['modernizr', 'bootstrapjs'], function (){
  console.log('Building JavaScript Libraries')
  gulp.src([config.locations.src.jspath, '!' + config.libraries.path.js])
    .pipe(notify({
      title: 'JavaScript Libraries build',
      message: 'Modernizr & Bootstrap',
      onLast: true,
      wait: false
    }))
});
/*---------------------------------------------------------------------------------------------------*/

/*Watch----------------------------------------------------------------------------------------------*/
//Watch - Runs configurable tasks, watches for file changes and runs sass appropriately
gulp.task('watch', 'Watches for file changes and runs sass appropriately.', function (cb) {
  gulpSequence(config.taskconfig.watchtasks,  'browsersync', cb)
  gulp.watch(config.locations.src.scsspath + '/**/*.s+(a|c)ss', ['sass']);
  gulp.watch(config.locations.src.scsspath + '/**/*.s+(a|c)ss', gulpif(config.taskconfig.watch.lintscss == true,(['sasslint'])));
  //Browsersync
  gulp.watch(config.locations.src.imagespath + '**/*', gulpif(config.browsersync.watch.images == true,(browserSync.reload)));
  gulp.watch(config.locations.dist.jspath + '**/*', gulpif(config.browsersync.watch.javascript == true,(browserSync.reload)));
  gulp.watch(config.locations.src.iconspath + '**/*', gulpif(config.browsersync.watch.icons == true,(browserSync.reload)));
  gulp.watch(config.locations.src.fontspath + '**/*', gulpif(config.browsersync.watch.fonts == true,(browserSync.reload)));
  gulp.watch(config.locations.src.templatepath + '**/*', gulpif(config.browsersync.watch.template == true,(browserSync.reload)));
  gulp.watch(config.locations.src.functionspath + '**/*.php', gulpif(config.browsersync.watch.phpfunctions == true,(browserSync.reload)));
  gulp.watch(config.general.themeroot + '**/*.yml', gulpif(config.browsersync.watch.yaml == true,(browserSync.reload)));
});
/*---------------------------------------------------------------------------------------------------*/

/*Accessibility--------------------------------------------------------------------------------------*/
gulp.task('pa11y', 'Perform a accessibility Audit on your site', pa11y({
  url: config.general.projectpath,
  standard: config.accessibility.pa11y.standard,
  failOnError: config.accessibility.pa11y.failonerror,
  showFailedOnly: config.accessibility.pa11y.showfailedonly,
  reporter: config.accessibility.pa11y.reporter,
  htmlcs: config.accessibility.pa11y.htmlcs,
  config: config.accessibility.pa11y.config,
  timeout: config.accessibility.pa11y.timeout,
}));
/*---------------------------------------------------------------------------------------------------*/

/*Misc---------------------------------------------------------------------------------------------*/
//Create a sizereport of your project
gulp.task('sizereport','Create a sizereport of your project', function () {
  return gulp.src(['**/*', '!**/node_modules/**/*'])
    .pipe(sizereport({
      gzip: true,
      '*': {
        'maxSize': config.quality.maxsize.maxsize
      },
    }));
});
gulp.task('check-deps', 'Check your dependencies', function() {
  return gulp.src('package.json').pipe(checkDeps());
});
/*---------------------------------------------------------------------------------------------------*/

/*Helper---------------------------------------------------------------------------------------------*/
//Helper class for notification actions
notify.on('click', function (options) {
  gulp.src(__filename)
    .pipe(plumber())
    .pipe(open({uri: 'http://localhost:3000'}));
});

//Clear Gulp Cache
gulp.task('clear', 'Clear Gulp Cache.',[], function (done) {
  return cache.clearAll(done);
});
/*---------------------------------------------------------------------------------------------------*/