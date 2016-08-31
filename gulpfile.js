/*==========================================================================
 Gulp for Drupal Gulpfile.js version 2.8.0 2016-08-31
 ===========================================================================*/
var gulp = require('gulp-help')(require('gulp'));
var config = require('./gulpconfig.json');
var path = require('path');
var sass = require('gulp-sass'); // sass compiler
var browserSync = require('browser-sync').create(); //Run synchronized server
var nano = require('gulp-cssnano'); //minifies css
var notify = require("gulp-notify"); //adds notifications to tasks
var plumber = require('gulp-plumber'); //Error Handling
var open = require('gulp-open'); // Opens url (from notification)
var autoprefixer = require('gulp-autoprefixer');  //adds prefixes to css files
var sourcemaps = require('gulp-sourcemaps'); // creates sourcemaps in css files
var modernizr = require('gulp-modernizr'); // creates custom modernizr file
var uglify = require('gulp-uglify'); // minifies javascript
var concat = require('gulp-concat'); //Concat files
var gulpif = require('gulp-if'); //conditional tasks
var addsrc = require('gulp-add-src'); //add files midstream
var gulpSequence = require('gulp-sequence'); //Run tasks in set sequence
var shell = require('gulp-shell'); //Run Shellcommands (used for pagespeedsinsight)
var imagemin = require('gulp-imagemin'); //Optimize images
var pngquant = require('imagemin-pngquant'); //Imagemin plugin to optimize PNG files with the pngquant library
var bytediff = require('gulp-bytediff'); //Size difference before and after alteration
var cache = require('gulp-cache'); //Cache stream
var rename = require("gulp-rename"); //Rename files
var filter = require('gulp-filter'); //Filter stream
var gzip = require('gulp-gzip');//gZip CSS & JavaScript
var sizereport = require('gulp-sizereport');//Create an sizereport for your project
var checkDeps = require('gulp-check-deps'); //Check the dependencies
var compass = require('compass-importer'); //Add ability for compass mixins
var sassLint = require('gulp-sass-lint'); //Lint SCSS for code consistency
var postcss = require('gulp-postcss'); //PostCSS support for Gulp
var colorblind = require("postcss-colorblind"); //PostCSS colorblind module to improve accessibility for colorblindness
var prompt = require('gulp-prompt'); //Get a prompt to configure tasks while running it
var Table = require('cli-table'); // create tables in console
var parker = require('gulp-parker'); //Parker stylesheet analysis
var UglifyJS = require('uglify-js'); //Library to minify JavaScript files
var eslint = require('gulp-eslint'); //Lint JavaScript with ESlint
var pa11y = require('gulp-pa11y'); //Pa11y accessibility audit
var bower = require('gulp-bower'); //install libraries via bower
var order = require("gulp-order"); //Order files in a stream, used for bootstrap js files
var debug = require('gulp-debug'); //returns files in stream
var $ = require('gulp-load-plugins')(); //dynamically load gulp plugins

var reload = browserSync.reload;

//Configure The Project
var projectpath = config.general.projectpath; //Project folder root
var logopath = config.general.logopath; //site logo - optional
var themeroot = config.general.themeroot;

//Path - SRC
var scsspathsrc = config.locations.src.scsspath; //Where to look for SCSS
var jspathsrc = config.locations.src.jspath; //Where to look for JavaScript
var imagepathsrc = config.locations.src.imagespath; //Where to look for the images
var fontspathsrc = config.locations.src.fontspath; //Where to look for font files
var iconspathsrc = config.locations.src.iconspath; //Where to look for icon files
var templatepathsrc = config.locations.src.templatepath; //Path to PHP or Twig Template
var functionspathsrc = config.locations.src.functionspath; //Path to PHP Functions

//Path - DIST
var csspathdist = config.locations.dist.csspath; //Where to put CSS
var jspathdist = config.locations.dist.jspath; //Destination for JavaScript files
var imagepathdist = config.locations.dist.imagespath; //Where to put the images (WARNING: cannot be the same as src!!)

//CSS
var stylescss = config.css.mainscssfile; //Main scss/css file without extension
var browsersupport = config.css.browsersupport; //Which browsers to support with autoprefixer
var cssminify = config.css.minify; //Want to minify your CSS?
var css_sourcemaps = config.css.sourcemaps.sourcemaps; //Want CSS sourcemaps?
var css_sourcemaps_location = config.css.sourcemaps.location; //Where to put sourcemaps (keep empty to place inline)
var css_sourcemaps_loadmaps = config.css.sourcemaps.loadmaps; //Load existing sourcemaps
var css_sourcemaps_identitymap = config.css.sourcemaps.identitymap; //Set to true to generate a full valid source map encoding no changes
var css_sourcemaps_debug = config.css.sourcemaps.debug; //Get debug messages
var css_sourcemaps_addcomment = config.css.sourcemaps.addcomment; //By default a comment containing / referencing the source map is added
var css_sourcemaps_includeContent = config.css.sourcemaps.includecontent; //By default the source maps include the source code. Pass false to use the original files.
var css_sourcemaps_charset = config.css.sourcemaps.charset; //Sets the charset for inline source maps. Default: utf8
var css_sourcemaps_destpath = config.css.sourcemaps.destpath; //Set the destination path (the same you pass to gulp.dest()).
var css_sourcemaps_sourcemappingurlprefix = config.css.sourcemaps.sourcemappingurlprefix; //Specify a prefix to be prepended onto the source map URL when writing external source maps.
var cssgzip = config.css.gzip; //Want to GZip your CSS files?
var css_exclude = config.css.exclude; //An array of SCSS files to exclude from compiling, example: bootstrap-grid.scss
var csscompass = config.css.compass; //Allow use of compass functions?
var cssspecificitygraphlocation = config.css.specificitygraphlocation; //Where to put Specificity Graph (if empty the folder will be: specificity-graph)
var parkerlog = config.css.parker.log; //Want to log the parker results in a external file
var parkerlogname = config.css.parker.logname; //Name the parkerlogfile

//JS
var jslibspath = config.js.jslibspath; //Where to put libraries as Modernizr and Bootstrap
var jspluginspath = config.js.jspluginspath; //Where to put libraries as Modernizr and Bootstrap
var js_eslint_config = config.js.eslint.configlocation; //Location of your ESlint config file
var js_sourcemaps = config.js.sourcemaps.sourcemaps; //Want JavaScript sourcemaps?
var js_sourcemaps_location = config.js.sourcemaps.location; //Where to put sourcemaps (keep empty to place inline)
var js_sourcemaps_loadmaps = config.js.sourcemaps.loadmaps; //Load existing sourcemaps
var js_sourcemaps_identitymap = config.js.sourcemaps.identitymap; //Set to true to generate a full valid source map encoding no changes
var js_sourcemaps_debug = config.js.sourcemaps.debug; //Get debug messages
var js_sourcemaps_addcomment = config.js.sourcemaps.addcomment; //By default a comment containing / referencing the source map is added
var js_sourcemaps_includeContent = config.js.sourcemaps.includecontent; //By default the source maps include the source code. Pass false to use the original files.
var js_sourcemaps_charset = config.js.sourcemaps.charset; //Sets the charset for inline source maps. Default: utf8
var js_sourcemaps_destpath = config.js.sourcemaps.destpath; //Set the destination path (the same you pass to gulp.dest()).
var js_sourcemaps_sourcemappingurlprefix = config.css.sourcemaps.sourcemappingurlprefix; //Specify a prefix to be prepended onto the source map URL when writing external source maps.
var jsminify = config.js.minify; //Minify JavaScript/
var jsgzip = config.js.gzip; //Want to GZip your JavaScript files?
var modernizrinclude = config.js.modernizr.alwaysinclude; //Which tests do you always want to include in modernizr
var modernizrexclude = config.js.modernizr.alwaysexclude; //Which tests do you always want to exclude in modernizr

//Images
var imagejpgprogressive = config.images.jpgprogressive; //Make JPEG images progressive for beter perceived performance
var imagepngoptimizationlevel = config.images.pngoptimizationlevel; //OPTIPNG optimisation level between 1 and 7 (7 maximum optimalisation, takes longer)
var imagegifinterlaced = config.images.gifinterlaced; //Interlaced or progressive gif images

//Libraries
var bower__path = config.libraries.bower.path; //Where to install bower components (default: bower_components)
var bower__interactive = config.libraries.bower.interactive; //enable prompting from bower
var bower__verbosity = config.libraries.bower.verbosity; //set verbosity level (0 = no output, 1 = error output, 2 = info)

//Configure Bootstrap CSS & JavaScript preferences
var bootstrapcsspath = config.css.bootstrap.path;
var bootstrapjspath = config.js.bootstrap.path;
var bootalertjs = config.js.bootstrap.alertjs;
var bootbuttonjs = config.js.bootstrap.buttonjs;
var bootcarouseljs = config.js.bootstrap.carouseljs;
var bootcollapsejs = config.js.bootstrap.collapsejs;
var bootdropdownjs = config.js.bootstrap.dropdownjs;
var bootmodaljs = config.js.bootstrap.modaljs;
var bootpopoverjs = config.js.bootstrap.popoverjs;
var bootscrollspyjs = config.js.bootstrap.scrollspyjs;
var boottabjs = config.js.bootstrap.tabjs;
var boottooltipjs = config.js.bootstrap.tooltipjs;

//Pre Gulp Watch tasks
var watchtasks = config.taskconfig.watchtasks; //Which tasks to run before gulp watch (Browsersync and SASS already included)
var watchlintscss = config.taskconfig.watch.lintscss; //Lint your SCSS
var watchimages = config.taskconfig.watch.images; //Want to process new or edited images?
var watchjs = config.taskconfig.watch.javascript; //Want to lint new or edited javascript files?

//Browsersync Settings
var browsersyncopen = config.browsersync.open; // Open browsersync page after starting server
var browsersyncloglevel = config.browsersync.loglevel; //Amount of Browsersync logging you want (debug, info or silent)
var browsersynclogfilechanges = config.browsersync.logfilechanges; //Commandline notification on refresh (gives you multiple messages on every change)
var bswatchimages = config.browsersync.watch.images; //Want to reload browsersync on new or edited images?
var bswatchicons = config.browsersync.watch.icons; //Reload browsersync on new,edited or removed icons
var bswatchfonts = config.browsersync.watch.fonts; //Reload browsersync on new, edited or removed fonts
var bswatchjs = config.browsersync.watch.javascript; //Want to reload browsersync JavaScript changes?
var bswatchphpfunctions = config.browsersync.watch.phpfunctions; //Want to reload browsersync on changes inside the Functions folder?
var bswatchtemplate = config.browsersync.watch.template; //Want to reload browsersync on changes inside the Templates folder?
var bswatchyaml = config.browsersync.watch.yaml;

//Share Settings
var shareopen = config.share.open; // Open share page after starting server
var shareclicks = config.share.clicks; // Sync clicks on share server
var shareforms = config.share.forms; //Sync forms on share server
var sharescroll = config.share.scroll; //Sync Scrolling on share server
var shareport = config.share.port; // Set port number for share server

//Quality
var maxsize = config.quality.maxsize.maxisize; //General max size of files, used with gulp sizereport
var maxsizecss = config.quality.maxsize.css; //Maximum size of CSS files
var maxsizejs = config.quality.maxsize.js; //Maximum size of JavaScript files
var maxsizeimages = config.quality.maxsize.images; //Maximum size of Images files

//SCSS Linter settings
var sasslint_configlocation = config.css.linter.config;

//Pa11y Accessibility Audit settings
var pa11y_standard = config.accessibility.pa11y.standard; //The standard to use. One of Section508, WCAG2A, WCAG2AA, WCAG2AAA. Default WCAG2AA.
var pa11y_failOnError = config.accessibility.pa11y.failonerror; //Fail your build if there is any accessibility error
var pa11y_showFailedOnly = config.accessibility.pa11y.showfailedonly; //Only display the errors in report, Set to false to display errros, warnings and notice.
var pa11y_reporter = config.accessibility.pa11y.reporter; //The reporter to use with Pa11y
var pa11y_htmlcs = config.accessibility.pa11y.htmlcs; //The URL to source HTML_CodeSniffer from
var pa11y_config = config.accessibility.pa11y.config; //The path to a JSON config file or a config object
var pa11y_timeout = config.accessibility.pa11y.timeout; //he number of milliseconds before a timeout error occurs.

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
  var filter_exclude = filter(css_exclude, {restore: false});
  return gulp.src(scsspathsrc + '/' + '**/*.s+(a|c)ss')
    .pipe(filter_exclude)
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(css_sourcemaps == true,sourcemaps.init({
      loadMaps: css_sourcemaps_loadmaps,
      identityMap: css_sourcemaps_identitymap,
      debug: css_sourcemaps_debug
    })))
    .pipe(gulpif(csscompass != true,sass()))
    .pipe(gulpif(csscompass == true,sass({ importer: compass }).on('error', sass.logError)))
    .pipe(autoprefixer({
      browsers: browsersupport,
      cascade: false
    }))
    .pipe(gulpif(css_sourcemaps == true,sourcemaps.write(css_sourcemaps_location, {
      addComment: css_sourcemaps_addcomment,
      includeContent: css_sourcemaps_includeContent,
      sourceRoot: function(file) {
        return '../'.repeat(file.relative.split('\\').length) + 'src';
      },
      destPath: css_sourcemaps_destpath,
      sourceMappingURLPrefix: css_sourcemaps_sourcemappingurlprefix,
      debug: css_sourcemaps_debug,
      charset: css_sourcemaps_charset,
    })))
    .pipe(gulp.dest(csspathdist))
    .pipe(filter_sourcemaps)
    .pipe(gulpif(cssminify == true, bytediff.start()))
    .pipe(gulpif(cssminify == true, nano()))
    .pipe(gulpif(cssminify == true,rename(function (path) {
      path.basename += ".min";
    })))
    .pipe(gulpif(cssminify == true, gulp.dest(csspathdist)))
    .pipe(gulpif(cssminify == true, bytediff.stop()))
    .pipe(gulpif(cssgzip == true, bytediff.start()))
    .pipe(gulpif(cssgzip == true,gzip()))
    .pipe(gulpif(cssgzip == true, gulp.dest(csspathdist)))
    .pipe(gulpif(cssgzip == true, bytediff.stop()))
    .pipe(filter_sourcemaps.restore)
    .pipe(sizereport({
      gzip: true,
      '*': {
        'maxSize': maxsizecss
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
  return gulp.src(scsspathsrc + '/' + '**/*.s+(a|c)ss')
    .pipe(sassLint({
      options: {
      },
      config: sasslint_configlocation
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

//Parker Stylesheet analysis
gulp.task('parker', 'Analyse your CSS files with parker', function() {
  return gulp.src(scsspathsrc + '/' + '**/*.s+(a|c)ss')
    .pipe(gulpif(csscompass != true,sass()))
    .pipe(gulpif(csscompass == true,sass({ importer: compass }).on('error', sass.logError)))
    .pipe(gulpif(parkerlog == true,parker({
      file: parkerlogname + '.md',
      title: 'Gulp Parker Test Report - ' + projectpath
    })))
    .pipe(gulpif(parkerlog != true,parker()))
});

// Create Specificity Graph
gulp.task('specificity','Create a specificity graph for CSS', function() {
  return gulp.src('', {
    read: false
  })
    .pipe($.shell([
      'specificity-graph ' + csspathdist + stylescss + '.css -o ' + cssspecificitygraphlocation,
    ]))
    .pipe($.notify({
      title: "Caches cleared",
      message: "Drupal Caches cleared.",
      onLast: true
    }));
});
/*---------------------------------------------------------------------------------------------------*/

/*Browsersync-----------------------------------------------------------------------------------------*/
//Browsersync - Run server with syncronized screens on multiple devices
gulp.task('browsersync', 'Run server with syncronized screens on multiple devices.', ['sass'], function() {
  browserSync.init({
    open: browsersyncopen,
    proxy: projectpath,
    logLevel: browsersyncloglevel,
    logFileChanges: browsersynclogfilechanges,
  });
  return gulp.src(scsspathsrc + '/' + stylescss + '.s+(a|c)ss')
    .pipe(plumber())
    .pipe(notify({
      title: "Browsersync Started",
      message: 'Click to launch browser',
      onLast: true,
      wait: true ,
      icon: path.join(__dirname, logopath),
    }))
    .pipe(plumber.stop());
});
//Share - Run browsersync server without syncronized actions, to share progress
gulp.task('share', 'Run server to share progress.', function() {
  browserSync.init({
    open: shareopen,
    ghostMode: {
      clicks: shareclicks,
      forms: shareforms,
      scroll: sharescroll
    },
    port: shareport,
    proxy: projectpath,
  });
  return gulp.src(scsspathsrc + '/' + stylescss + '.s+(a|c)ss')
    .pipe(notify({
      title: "Server started",
      message: "Share server started on port: " + shareport,
      wait: false ,
    }));
});
/*---------------------------------------------------------------------------------------------------*/

/*Javascript-----------------------------------------------------------------------------------------*/
// JS Lint
gulp.task('jslint', 'JavaScript checker.', function() {
  return gulp.src([jspathsrc + '**/*.js', '!' + bootstrapjspath + '**/*.js', '!' + jslibspath + '**/*.js', '!' + jspluginspath + '**/*.js','!node_modules/**'])
    .pipe(reload({
      stream: true,
      once: true
    }))
    .pipe(eslint({
      // Load a specific ESLint config
      config: js_eslint_config
    }))
    .pipe(eslint.format());
});
/*---------------------------------------------------------------------------------------------------*/

/*Libraries------------------------------------------------------------------------------------------*/
//Install libraries via Bower, configure in bower.json
gulp.task('bower', 'Install libraries via Bower', function() {
  return bower({
    directory: './' + bower__path,
    interactive: bower__interactive,
    verbosity: bower__verbosity
  })
});

//remove unnessesary files from bower_components, configured in bower.json
var preen = require('preen', 'Remove unneeded files from bower components');
gulp.task('preen', function(cb) {
  return preen.preen({}, cb);
});

//Get Bootstrap CSS from bower components
gulp.task('getbootstrapcss', 'Get Bootstrap SCSS files.', function () {
  gulp.src(bower__path + '/bootstrap/scss/**/*.scss')
    .pipe(gulp.dest(bootstrapcsspath));
});

//Bootstrap - generate bootstrap javascript file, also uglified
gulp.task('bootstrapjs', 'Generate bootstrap javascript file, also uglified.', function () {
  const filter__sourcemaps = filter(['**/*.js', '!**/*.map']);
  return gulp.src([bower__path + "/bootstrap/js/dist/util.js"])
    .pipe(plumber())
    .pipe(gulpif(bootalertjs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'alert.js'))))
    .pipe(gulpif(bootbuttonjs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'button.js'))))
    .pipe(gulpif(bootcarouseljs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'carousel.js'))))
    .pipe(gulpif(bootcollapsejs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'collapse.js'))))
    .pipe(gulpif(bootdropdownjs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'dropdown.js'))))
    .pipe(gulpif(bootmodaljs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'modal.js'))))
    .pipe(gulpif(bootpopoverjs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'popover.js'))))
    .pipe(gulpif(bootscrollspyjs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'scrollspy.js'))))
    .pipe(gulpif(boottabjs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'tab.js'))))
    .pipe(gulpif(boottooltipjs == true, (addsrc(bower__path + "/tether/dist/js/tether.js"))))
    .pipe(gulpif(boottooltipjs == true, (addsrc(bower__path + "/bootstrap/js/dist/" + 'tooltip.js'))))
    .pipe(filter__sourcemaps)
    .pipe(gulpif(js_sourcemaps == true, sourcemaps.init({
      loadMaps: js_sourcemaps_loadmaps,
      identityMap: js_sourcemaps_identitymap,
      debug: js_sourcemaps_debug
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
    .pipe(debug({title: 'Using file:'}))
    .pipe(concat('bootstrap.js'))
    .pipe(gulpif(js_sourcemaps == true, sourcemaps.write(js_sourcemaps_location, {
      addComment: js_sourcemaps_addcomment,
      includeContent: js_sourcemaps_includeContent,
      sourceRoot: function (file) {
        return '../'.repeat(file.relative.split('\\').length) + 'src';
      },
      destPath: js_sourcemaps_destpath,
      sourceMappingURLPrefix: js_sourcemaps_sourcemappingurlprefix,
      debug: js_sourcemaps_debug,
      charset: js_sourcemaps_charset,
    })))
    .pipe(plumber.stop())
    .pipe(gulp.dest(jslibspath))
    .pipe(sizereport({
      minifier: function (contents, filepath) {
        if (filepath.match(/\.min\./g)) {
          return contents
        }
        return UglifyJS.minify(contents, {fromString: true}).code;
      },
      gzip: true,
      '*': {
        'maxSize': maxsizejs
      }
    }))
    .pipe(gulpif(jsminify == true, uglify()))
    .pipe(gulpif(jsminify == true, rename(function (path) {
      path.basename += ".min";
    })))
    .pipe(gulpif(jsminify == true, gulp.dest(jslibspath)))
    .pipe(gulpif(jsgzip == true, gzip()))
    .pipe(gulpif(jsgzip == true, gulp.dest(jslibspath)))
});

//Modernizr - Create modernizr file from SCSS selectors and Javascript, Also uglified the file
gulp.task('modernizr', 'Create modernizr file from SCSS selectors and Javascript, Also uglified the file.', function() {
  gulp.src([jspathsrc + '**/*.js', scsspathsrc + '/**/*.s+(a|c)ss', '!' + jslibspath + '**/*.js'])
    .pipe(modernizr({
      excludeTests: modernizrexclude,
      options : modernizrinclude,
    }))
    .pipe(gulp.dest(jslibspath))
    .pipe(sizereport({
      minifier: function (contents, filepath) {
        if (filepath.match(/\.min\./g)) {
          return contents
        }
        return UglifyJS.minify(contents, { fromString: true }).code;
      },
      gzip: true,
      '*': {
        'maxSize': maxsizejs
      }
    }))
    .pipe(gulpif(jsminify == true,uglify()))
    .pipe(gulpif(jsminify == true,rename(function (path) {
      path.basename += ".min";
    })))
    .pipe(gulpif(jsminify == true,gulp.dest(jslibspath)))
    .pipe(gulpif(jsgzip == true,gzip()))
    .pipe(gulpif(jsgzip == true,gulp.dest(jslibspath)))
});

//JS - Building JavaScript Libraries, Modernizr and Bootstrap
gulp.task('jslibs', 'Building JavaScript Libraries, Modernizr and Bootstrap.', ['modernizr', 'bootstrapjs'], function (){
  console.log('Building JavaScript Libraries')
  gulp.src([jspathsrc])
    .pipe(notify({
      title: 'JavaScript Libraries build',
      message: 'Modernizr & Bootstrap',
      onLast: true,
      wait: false
    }))
});
/*---------------------------------------------------------------------------------------------------*/

/*Images----------------------------------------------------------------------------------------------*/
//Images - Optimizes images (JPG, PNG, GIF and SVG)
gulp.task('images', 'Optimizes images (JPG, PNG, GIF and SVG).', function(){
  return gulp.src(imagepathsrc + '**/*')
    .pipe(bytediff.start())
    .pipe(cache(imagemin({
      progressive: imagejpgprogressive, //JPEG
      optimizationLevel: imagepngoptimizationlevel, //PNG
      interlaced: imagegifinterlaced, //GIF
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    })))
    .pipe(bytediff.stop())
    .pipe(sizereport({
      gzip: false,
      '*': {
        'maxSize': maxsizeimages
      },
    }))
    .pipe(gulp.dest(imagepathdist))
    .pipe(notify({
      title: 'Images Optimized',
      message: 'Image Optimalisation Complete',
      onLast: true,
      wait: false
    }));
});
/*---------------------------------------------------------------------------------------------------*/

/*Watch----------------------------------------------------------------------------------------------*/
//Watch - Runs configurable tasks, watches for file changes and runs sass appropriately
gulp.task('watch', 'Watches for file changes and runs sass appropriately.', function (cb) {
  gulpSequence(watchtasks,  'browsersync', cb)
  gulp.watch(scsspathsrc + '/**/*.s+(a|c)ss', ['sass']);
  gulp.watch(scsspathsrc + '/**/*.s+(a|c)ss', gulpif(watchlintscss == true,(['sasslint'])));
  gulp.watch(jspathsrc + '**/*.js', gulpif(watchjs == true,(['jslint'])));
  gulp.watch(imagepathsrc + '**/*', gulpif(watchimages == true,(['images'])));
  //Browsersync
  gulp.watch(imagepathsrc + '**/*', gulpif(bswatchimages == true,(browserSync.reload)));
  gulp.watch(jspathdist + '**/*', gulpif(bswatchjs == true,(browserSync.reload)));
  gulp.watch(iconspathsrc + '**/*', gulpif(bswatchicons == true,(browserSync.reload)));
  gulp.watch(fontspathsrc + '**/*', gulpif(bswatchfonts == true,(browserSync.reload)));
  gulp.watch(templatepathsrc + '**/*', gulpif(bswatchtemplate == true,(browserSync.reload)));
  gulp.watch(functionspathsrc + '**/*.php', gulpif(bswatchphpfunctions == true,(browserSync.reload)));
  gulp.watch(themeroot + '**/*.yml', gulpif(bswatchyaml == true,(browserSync.reload)));
});
/*---------------------------------------------------------------------------------------------------*/

/*Accessibility--------------------------------------------------------------------------------------*/
gulp.task('colorblind', 'Simulate colorblindness', function(){
  var colorblindTable = new Table();
  colorblindTable.push(
    { 'Trichromat - 3 good cones': ['Normal', '',''] },
    { 'Anomalous Trichromat - 2 good cones, 1 bad': ['Protanomaly (low red) (M1,3% / F0,2%)', 'Deuteranomaly (low green) (M5,0% / F0,35%)', 'Tritanomaly (low blue) (M0,01% / F0,01%)'] },
    { 'Dichromat - 2 good cones, 1 blind': ['Protanopia (no red) (M1,3% / F0,02%)', 'Deuteranopia (no green) (M1,2% / F0,01%)', 'Tritanopia (no blue) (M0,001% / F0,03%)'] },
    { 'Monochromat - 1 good cone, 2 blind/bad': ['Achromatomaly (almost no color) (M0.00001% / F0.00001%)', 'Achromatopsia (no color) (M0.00001% / F0.00001%)', ''] }
  );
  console.log("Prevalence of color blindness: M - Males, F - Females (http://www.colour-blindness.com/general/prevalence/)");
  console.log(colorblindTable.toString());
  return gulp.src('./', {read: false})
    .pipe(prompt.prompt({
        type: 'rawlist',
        name: 'colorblindnessvariation',
        message: 'Which Colorblindness variation would you genarate a CSS file for?',
        choices: ['Protanomaly', 'Protanopia', 'Deuteranomaly', 'Deuteranopia', 'Tritanomaly', 'Tritanopia', 'Achromatomaly', 'Achromatopsia']
      }, function(res){
        var processors = [ colorblind({method:res.colorblindnessvariation}) ];
        return gulp.src(scsspathsrc + '/' + '**/*.s+(a|c)ss')
          .pipe(gulpif(csscompass != true,sass()))
          .pipe(gulpif(csscompass == true,sass({ importer: compass }).on('error', sass.logError)))
          .pipe(postcss(processors))
          .pipe(plumber())
          .pipe(gulp.dest(csspathdist))
          .pipe(gulpif(cssminify == true, bytediff.start()))
          .pipe(gulpif(cssminify == true, nano()))
          .pipe(gulpif(cssminify == true,rename(function (path) {
            path.basename += ".min";
          })))
          .pipe(gulpif(cssminify == true, gulp.dest(csspathdist)))
          .pipe(gulpif(cssminify == true, bytediff.stop()))
          .pipe(gulpif(cssgzip == true, bytediff.start()))
          .pipe(gulpif(cssgzip == true,gzip()))
          .pipe(gulpif(cssgzip == true, gulp.dest(csspathdist)))
          .pipe(gulpif(cssgzip == true, bytediff.stop()))
          .pipe(plumber.stop())
      }
    ))
});

gulp.task('pa11y', 'Perform a accessibility Audit on your site', pa11y({
  url: projectpath,
  standard: pa11y_standard,
  failOnError: pa11y_failOnError,
  showFailedOnly: pa11y_showFailedOnly,
  reporter: pa11y_reporter,
  htmlcs: pa11y_htmlcs,
  config: pa11y_config,
  timeout: pa11y_timeout,
}));
/*---------------------------------------------------------------------------------------------------*/

/*Misc---------------------------------------------------------------------------------------------*/
//Create a sizereport of your project
gulp.task('sizereport','Create a sizereport of your project', function () {
  return gulp.src(['**/*', '!**/node_modules/**/*'])
    .pipe(sizereport({
      gzip: true,
      '*': {
        'maxSize': maxsize
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