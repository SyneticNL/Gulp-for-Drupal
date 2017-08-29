/*==========================================================================
 Gulp for Drupal Gulpfile.js version 4.0.0 2017-08-11
 ===========================================================================*/
var
  gulp = require('gulp'),
  config = require('./gulpconfig.json'),
  fs = require('fs'),
  path = require('path'),
  package = require('./package.json');

var
  autoprefixer = require('gulp-autoprefixer'),  // Adds prefixes to css files
  browserSync = require('browser-sync').create(), // Run synchronized server
  bytediff = require('gulp-bytediff'), // Size difference before and after alteration
  cache = require('gulp-cache'), // Cache stream
  checkDeps = require('gulp-check-deps'), // Check the dependencies
  compass = require('compass-importer'), // Add ability for compass mixins
  concat = require('gulp-concat'), // Concat files
  filter = require('gulp-filter'), // Filter stream
  gulpif = require('gulp-if'), // Conditional tasks
  gzip = require('gulp-gzip'), // gZip CSS & JavaScript
  modernizr = require('customizr'), // Create custom modernizr file
  nano = require('gulp-cssnano'), // Minifies css
  notify = require('gulp-notify'), // Adds notifications to tasks
  open = require('gulp-open'), // Opens url (from notification)
  order = require('gulp-order'), // Order files in a stream, used for bootstrap js files
  Parker = require('parker'), // Parker stylesheet analysis
  plumber = require('gulp-plumber'), // Error Handling
  postcss = require('gulp-postcss'), // PostCSS support for Gulp
  rename = require('gulp-rename'), // Rename files
  sass = require('gulp-sass'), // Sass compiler
  sassLint = require('gulp-sass-lint'), // Lint SCSS for code consistency
  sizereport = require('gulp-sizereport'), // Create an sizereport for your project
  sourcemaps = require('gulp-sourcemaps'), // Creates sourcemaps in css files
  uglify = require('gulp-uglify'), // Minifies javascript
  bulkSass = require('gulp-sass-glob-import'), // Enables @import folder functionality in Sass
  through2 = require('through2'),
  imagemin = require('imagemin'), //Optimize images
  imageminJpegoptim = require('imagemin-jpegoptim'), //jpegoptim plugin for imagemin
  imageminPngquant = require('imagemin-pngquant'), //PNGquant plugin for imagemin
  imageminWebp = require('imagemin-webp'), //Webp plugin for imagemin
  imageminGifsicle = require('imagemin-gifsicle'),
  imageminSvgo = require('imagemin-svgo'),
  clean = require('gulp-clean'),
  cssstats = require('cssstats');

/*====================================================================================================
 =====================================================================================================*/

/*CSS------------------------------------------------------------------------------------------------*/
//SASS - Compile Sass, create sourcemaps, autoprefix and minify
function styles() {
  var onError = function (err) {
    notify.onError({
      title: 'Error in Sass',
      message: "<%= error.message %>",
      sound: 'Beep'
    })(err);
    this.emit('end');
  };
  var filter_sourcemaps = filter(['**/*', '!**/*.map'], {restore: true});
  var filter_exclude = filter(config.css.exclude, {restore: false});
  return gulp.src([config.locations.styles.src + '/' + '**/*.s+(a|c)ss', '!' + config.locations.styles.libraries + '/**/*'])
    .pipe(filter_exclude)
    .pipe(bulkSass())
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(config.css.sourcemaps.generate === true, sourcemaps.init({
      loadMaps: config.css.sourcemaps.loadmaps,
      identityMap: config.css.sourcemaps.identitymap,
      debug: config.css.sourcemaps.debug
    })))
    .pipe(gulpif(config.css.compass !== true, sass()))
    .pipe(gulpif(config.css.compass === true, sass({importer: compass}).on('error', sass.logError)))
    .pipe(autoprefixer({
      browsers: config.css.browsersupport,
      cascade: false
    }))
    .pipe(gulpif(config.css.sourcemaps.generate === true, sourcemaps.write(config.css.sourcemaps.location, {
      addComment: config.css.sourcemaps.addcomment,
      includeContent: config.css.sourcemaps.includeContent,
      sourceRoot: function (file) {
        return '../'.repeat(file.relative.split('\\').length) + 'src';
      },
      destPath: config.css.sourcemaps.destpath,
      sourceMappingURLPrefix: config.css.sourcemaps.sourcemappingurlprefix,
      debug: config.css.sourcemaps.debug,
      charset: config.css.sourcemaps.charset
    })))
    .pipe(gulp.dest(config.locations.styles.dist))
    .pipe(filter_sourcemaps)
    .pipe(gulpif(config.css.minify === true, bytediff.start()))
    .pipe(gulpif(config.css.minify === true, nano()))
    .pipe(gulpif(config.css.minify === true, rename(function (path) {
      path.basename += '.min';
    })))
    .pipe(gulpif(config.css.minify === true, gulp.dest(config.locations.styles.dist)))
    .pipe(gulpif(config.css.minify === true, bytediff.stop()))
    .pipe(gulpif(config.css.gzip === true, bytediff.start()))
    .pipe(gulpif(config.css.gzip === true, gzip()))
    .pipe(gulpif(config.css.gzip === true, gulp.dest(config.locations.styles.dist)))
    .pipe(gulpif(config.css.gzip === true, bytediff.stop()))
    .pipe(filter_sourcemaps.restore)
    .pipe(sizereport({
      gzip: true,
      '*': {
        'maxSize': config.quality.maxsize.css
      }
    }))
    .pipe(plumber.stop())
    .pipe(browserSync.stream())
    .pipe(plumber())
    .pipe(notify({
      title: 'Sass Compiled',
      message: '<%= file.relative %>',
      onLast: true,
      wait: false
    }))
    .pipe(plumber.stop());
}


//SASSlinter validates your SCSS
function lint() {
  return gulp.src([config.locations.styles.src + '/' + '**/*.s+(a|c)ss', '!' + config.locations.styles.libraries + '/**/*'])
    .pipe(sassLint({
      options: {},
      config: config.css.linter.config
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
}

//Parker Stylesheet analysis
function parker(cb) {
  metrics = require('./node_modules/parker/metrics/all');
  var parker = new Parker(metrics);
  fs.readdir(config.locations.styles.dist, function (err, files) {
    if(err) {
      console.error('Could read the directory', err);
      process.exit(1);
    }
    files.forEach( function (file, index) {
      if (path.extname(file) === '.css') {
        fs.readFile('css/' + file, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          console.log('\n' + file);
          console.log(parker.run(data));
        });
      }
    });
  });
  // cb();
}

//Analyse CSS
function cssStats() {
  fs.readdir(config.locations.styles.dist, function (err, files) {
    if (err) {
      console.error('Could read the directory', err);
      process.exit(1);
    }
    files.forEach(function (file, index) {
      if (path.extname(file) === '.css') {
        fs.readFile('css/' + file, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          console.log('\n' + file);
          console.log(cssstats(data));
        });
      }
    });
  });
}
/*---------------------------------------------------------------------------------------------------*/

/*Browsersync-----------------------------------------------------------------------------------------*/
function bs(mode) {
  browserSync.init(mode);

  return gulp.src('./', {read: false})
    .pipe(plumber())
    .pipe(notify({
      title: 'Browsersync Started',
      message: 'Click to launch browser',
      onLast: true,
      wait: true,
      icon: path.join(__dirname, config.general.logopath)
    }))
    .pipe(plumber.stop());
}

function browsersync() {
  console.log(config.general.projectpath);
  var settings = {
    open: config.browsersync.open,
    proxy: config.general.projectpath,
    logLevel: config.browsersync.loglevel,
    logFileChanges: config.browsersync.logfilechanges
  };
  bs(settings);
}

function share() {
  var settings = {
    open: config.share.open,
    ghostMode: {
      clicks: config.share.clicks,
      forms: config.share.forms,
      scroll: config.share.scroll
    },
    port: config.share.port,
    proxy: config.general.projectpath
  };
  bs(settings);
}

// Bootstrap - generate bootstrap javascript file, also uglified
function bootstrap() {
  var bootstrap = [config.locations.javascript.libraries + '/bootstrap/util.js'];
  for (var prop in config.js.bootstrap) {
    if (config.js.bootstrap[prop]) {
      var path = config.locations.javascript.libraries + '/bootstrap/' + prop + '.js';
      bootstrap.push(path);
      if (prop === 'tooltip') {
        bootstrap.push(config.locations.javascript.libraries + '/tether/tether.js');
      }
    }
  }
  return gulp.src(bootstrap)
    .pipe(plumber())
    .pipe(gulpif(config.js.sourcemaps.generate == true, sourcemaps.init({
      loadMaps: config.js.sourcemaps.loadmaps,
      identityMap: config.js.sourcemaps.identitymap,
      debug: config.js.sourcemaps.debug
    })))
    .pipe(order([
      '**/*/util.js',
      '**/*/alert.js',
      '**/*/button.js',
      '**/*/carousel.js',
      '**/*/collapse.js',
      '**/*/dropdown.js',
      '**/*/modal.js',
      '**/*/scrollspy.js',
      '**/*/tab.js',
      '**/*/tether.js',
      '**/*/tooltip.js',
      '**/*/popover.js'
    ], {base: './'}))
    .pipe(concat('bootstrap.js'))
    .pipe(gulpif(config.js.sourcemaps.generate == true, sourcemaps.write(config.js.sourcemaps.location, {
      addComment: config.js.sourcemaps.addcomment,
      includeContent: config.js.sourcemaps.includeContent,
      sourceRoot: function (file) {
        return '../'.repeat(file.relative.split('\\').length) + 'src';
      },
      destPath: config.js.sourcemaps.destpath,
      sourceMappingURLPrefix: config.js.sourcemaps.sourcemappingurlprefix,
      debug: config.js.sourcemaps.debug,
      charset: config.js.sourcemaps.charset
    })))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.locations.javascript.libraries))
    .pipe(gulpif(config.js.minify === true, uglify()))
    .pipe(gulpif(config.js.minify === true, rename(function (path) {
      path.basename += '.min';
    })))
    .pipe(gulpif(config.js.minify === true, gulp.dest(config.locations.javascript.libraries)))
    .pipe(gulpif(config.js.gzip === true, gzip()))
    .pipe(gulpif(config.js.gzip === true, gulp.dest(config.locations.javascript.libraries)));
}

//Modernizr - Create modernizr file from SCSS selectors and Javascript, Also uglified the file
function generateModernizr(cb) {
  var filename;
  if (config.js.minify) {
    filename = config.locations.javascript.libraries + 'modernizr.min.js';
  } else {
    filename = config.locations.javascript.libraries + 'modernizr.js';
  }
  modernizr({
    cache: true,
    devFile: false,
    dest: filename,
    options: [
      'setClasses',
      'addTest',
      'html5printshiv',
      'testProp',
      'fnBind'
    ],
    uglify: config.js.minify,
    tests: config.js.modernizr.include,
    excludeTests: config.js.modernizr.exclude,
    crawl: true,
    useBuffers: false,
    files: {
      src: [config.locations.javascript.src + '**/*.js', config.locations.styles.src + '/**/*.s+(a|c)ss', '!' + config.locations.javascript.libraries + '**/*.js']
    },
    customTests: []
  }, function () { });
  cb();
}
/*---------------------------------------------------------------------------------------------------*/

/*Images----------------------------------------------------------------------------------------------*/
function images() {
  image(config.locations.images.src + '**/*');
}
//Image - Optimizes images (JPG, PNG, GIF and SVG)
function image(path) {
  var basePath = path.replace('**/*', '');
  fs.readdir(basePath, (err, files) => {
    files.forEach(file => {
      if (fs.lstatSync(basePath + file).isDirectory()) {
      optimizImage(basePath + file + '**/*', config.locations.images.dist + file);
      if (config.images.webp.use) {
          convertWebP(basePath + file + '**/*', config.locations.images.dist + file);
        }
      }
    });
    optimizImage(basePath + '*.*', config.locations.images.dist);
    if (config.images.webp.use) {
      convertWebP(basePath + '*.*', config.locations.images.dist);
    }
  });
}
var imageminZopfli = require('imagemin-zopfli');
function optimizImage(path, dest) {
  imagemin([path], dest, {
    plugins: [
      imageminGifsicle({
        interlaced: config.images.gif.interlaced,
        optimizationLevel: config.images.gif.optimizationlevel
      }),
      imageminJpegoptim({
        progressive: config.images.jpeg.progressive,
        max: config.images.jpeg.max
      }),
      imageminPngquant({
        floyd: config.images.png.floyd,
        nofs: config.images.png.nofs,
        quality: config.images.png.quality,
        speed: config.images.png.speed,
        verbose: config.images.png.verbose
      }),
      imageminZopfli({more: true}),
      imageminSvgo()
    ]
  });
}

function convertWebP(path, dest) {
  imagemin([path], dest, {
    plugins: [
      imageminWebp({quality: 50})
    ]
  });
}
/*---------------------------------------------------------------------------------------------------*/

/*Watch----------------------------------------------------------------------------------------------*/
//Watch - Runs configurable tasks, watches for file changes and runs sass appropriately
function watchFiles(cb) {
  console.log('Watching Files');
  for (var prop in config.watch) {
    console.log(prop);
    if (!config.watch.hasOwnProperty(prop)) continue;
    if (config.watch[prop].use) {
      for (var extension in config.watch[prop].extensions) {
        var watch = [];
        if (typeof config.locations[prop].src === 'string') {
          watch.push(config.locations[prop].src + '**/*.' + config.watch[prop].extensions[extension]);
        } else {
          for (var path in config.locations[prop].src) {
            watch.push(config.locations[prop].src[path] + '**/*.' + config.watch[prop].extensions[extension]);
          }
        }
        if (config.watch[prop].tasks !== undefined) {
          gulp.watch(watch, gulp.series(config.watch[prop].tasks))
            .on('all', function (event, path, stats) {
              console.log('File ' + path + ' was ' + event + ', running tasks...');
              browserSync.reload();
            });
        } else {
          gulp.watch(watch)
            .on('all', function (event, path, stats) {
              console.log('File ' + path + ' was ' + event + ', running tasks...');
              browserSync.reload();
            });
        }
      }
    }
  }

  if (config.watch.images.use) {
    gulp.watch(config.locations.images.src + '**/*')
    .on('all', function (event, path, stats) {
      if (event !== 'unlink') {
        image(path);
      }
      else {
        var newPath = path.replace(config.locations.images.src, config.locations.images.dist);
        deleteFile(newPath);
        if (config.images.webp.use) {
          var webpPath = newPath.replace(newPath.substr(newPath.lastIndexOf('.')), '.webp');
          deleteFile(webpPath);
        }
      }
    });
  }
}
/*---------------------------------------------------------------------------------------------------*/

/*Misc---------------------------------------------------------------------------------------------*/
//Create a sizereport of your project
function generateSizereport(cb) {
  return gulp.src(['**/*', '!**/node_modules/**/*'])
    .pipe(sizereport({
      gzip: true,
      '*': {
        maxSize: config.quality.maxsize.general
      }
    }));
  cb();
}

//heck your dependencies
function checkdependencies() {
  return gulp.src('package.json').pipe(checkDeps());
}

function deleteFile(path) {
  console.log('Removing file: ' + path);
  return gulp.src(path, {read: false})
    .pipe(clean());
}
/*---------------------------------------------------------------------------------------------------*/

/*Helper---------------------------------------------------------------------------------------------*/
//Helper class for notification actions
notify.on('click', function (options) {
    gulp.src(__filename)
        .pipe(plumber())
        .pipe(open({uri: 'http://localhost:3000'}));
});

function synchro(done) {
  return through2.obj(function (data, enc, cb) {
    cb();
  },
  function (cb) {
    cb();
    done();
  });
}

//Clear Gulp Cache
function cacheClear(done) {
  return cache.clearAll(done);
}
// /*---------------------------------------------------------------------------------------------------*/
exports.styles = styles;
styles.description = 'Compile SCSS';
exports.lint = lint;
lint.description = 'Lint SCSS Files';
exports.parker = parker;
parker.description = 'Parker Stylesheet analysis';
exports.browsersync = browsersync;
browsersync.description = 'Synchronised browser testing';
exports.share = share;
share.description = 'Browsersync Server without Synchronising';
exports.generateModernizr = generateModernizr;
generateModernizr.description = 'Generate Modernizr.js file based on CSS and JS';
exports.generateSizereport = generateSizereport;
generateSizereport.description = 'Generate report of project size';
exports.checkdependencies = checkdependencies;
checkdependencies.description = 'Check for Node Updates';
exports.cacheClear = cacheClear;
cacheClear.description = 'Clear Gulp Cache (for images)';
exports.bootstrap = bootstrap;
bootstrap.description = 'Generate Bootstap JS';
exports.watchFiles = watchFiles;
watchFiles.description = 'Watch for file changing';
exports.images = images;
images.description = 'Optimize Images';
exports.cssStats = cssStats;
cssStats.description = 'Statistics about your CSS';

var serve = gulp.series(styles, bs);
serve.description = 'Compile SCSS and serve files (without watching)';
var js = gulp.parallel(bootstrap, generateModernizr);
js.description = 'Generate JS files (Bootstrap and Modernizr)';
var watch = gulp.series(styles, gulp.parallel(bs, watchFiles));
watch.description = 'Compile SCSS and serve files (with watching)';

gulp.task('default', watch);
gulp.task('styles', styles);
gulp.task('sass', styles);
gulp.task('lint', lint);
gulp.task('parker', parker);
gulp.task('serve', serve);
gulp.task('browsersync', browsersync);
gulp.task('share', share);
gulp.task('modernizr', generateModernizr);
gulp.task('sizereport', generateSizereport);
gulp.task('cd', checkdependencies);
gulp.task('cr', cacheClear);
gulp.task('bootstrap', bootstrap);
gulp.task('js', js);
gulp.task('watch--files-only', watchFiles);
gulp.task('watch', watch);
gulp.task('images', images);
gulp.task('stats', cssStats);