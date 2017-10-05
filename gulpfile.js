/*==========================================================================
 Gulp for Drupal Gulpfile.js version 4.1.1 2017-09-27
 ===========================================================================*/
var
  gulp = require('gulp'),
  config = require('./gulpconfig.json'),
  fs = require('fs'),
  path = require('path'),
  _ = require('underscore-node');

if (config.allowLocalOverride){
  try {
    var local = require('./gulpconfig.local.json');
    var temp = createConfig(config, local);
    config = temp;
    console.log("Using Local Project Config");
  } catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
      console.log("Using Project Config");
    else
      throw e;
  }
}

//Build the configuration by combining the project and local gulpconfig files
function createConfig(config, local) {
  var newConfig = {};
  Object.keys(config).forEach(function(key) {
    if (typeof config[key] === 'object') {
      if (_.isEmpty(local[key])){
        newConfig[key] = config[key];
      } else {
        newConfig[key] = createConfig(config[key], local[key]);
      }
    } else {
      if (_.isEmpty(local[key])){
        newConfig[key] = config[key];
      } else {
        newConfig[key] = local[key];
      }
    }
  });
  return newConfig;
}

var
  autoprefixer = require('gulp-autoprefixer'),  // Adds prefixes to css files
  browserSync = require('browser-sync').create(), // Run synchronized server
  bulkSass = require('gulp-sass-glob-import'), // Enables @import folder functionality in Sass
  bytediff = require('gulp-bytediff'), // Size difference before and after alteration
  chalk = require('chalk'),
  compass = require('compass-importer'), // Add ability for compass mixins
  concat = require('gulp-concat'), // Concat files
  clean = require('gulp-clean'),
  cssstats = require('cssstats'),
  filter = require('gulp-filter'), // Filter stream
  flatten = require('gulp-flatten'),
  gulpif = require('gulp-if'), // Conditional tasks
  gzip = require('gulp-gzip'), // gZip CSS & JavaScript
  imagemin = require('imagemin'), //Optimize images
  imageminGifsicle = require('imagemin-gifsicle'),
  imageminJpegoptim = require('imagemin-jpegoptim'), //jpegoptim plugin for imagemin
  imageminPngquant = require('imagemin-pngquant'), //PNGquant plugin for imagemin
  imageminSvgo = require('imagemin-svgo'),
  imageminWebp = require('imagemin-webp'), //Webp plugin for imagemin
  jsonfile = require('jsonfile'),
  log = require('fancy-log'),
  modernizr = require('customizr'), // Create custom modernizr file
  nano = require('gulp-cssnano'), // Minifies css
  notifier = require('node-notifier'), // Adds notifications to tasks
  open = require('open'), // Opens url (from notification)
  order = require('gulp-order'), // Order files in a stream, used for bootstrap js files
  Parker = require('parker'), // Parker stylesheet analysis
  plumber = require('gulp-plumber'), // Error Handling
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'), // Rename files
  sass = require('gulp-sass'), // Sass compiler
  sassLint = require('gulp-sass-lint'), // Lint SCSS for code consistency
  sizereport = require('gulp-sizereport'), // Create an sizereport for your project
  sourcemaps = require('gulp-sourcemaps'), // Creates sourcemaps in css files
  through2 = require('through2'),
  uglify = require('gulp-uglify'), // Minifies javascript
  os = require('os'),
  ifaces = os.networkInterfaces();

/*====================================================================================================
 =====================================================================================================*/

/*CSS------------------------------------------------------------------------------------------------*/
//SASS - Compile Sass, create sourcemaps, autoprefix and minify
function styles() {
  var onError = function (err) {
    error(err, 'Styles')
  };
  var filter_sourcemaps = filter(['**/*', '!**/*.map'], {restore: true});
  var excludeFiles = config.styles.exclude;
  excludeFiles.unshift('**/*');
  var filter_exclude = filter(excludeFiles, {restore: false});
  return gulp.src([config.locations.styles.src + '/' + '**/*.s+(a|c)ss', '!' + config.locations.styles.libraries + '/**/*'])
    .pipe(filter_exclude)
    .pipe(bulkSass())
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(config.styles.sourcemaps.generate === true, sourcemaps.init({
      loadMaps: config.styles.sourcemaps.loadmaps,
      identityMap: config.styles.sourcemaps.identitymap,
      debug: config.styles.sourcemaps.debug
    })))
    .pipe(gulpif(config.styles.compass !== true, sass()))
    .pipe(gulpif(config.styles.compass === true, sass({importer: compass}).on('error', sass.logError)))
    .pipe(autoprefixer({
      browsers: config.styles.browsersupport,
      cascade: false
    }))
    .pipe(gulpif(config.styles.normalize.use === true, postcss([
      require('postcss-normalize')({
        browsers: config.styles.browsersupport,
        forceImport: config.styles.normalize.force,
        allowDuplicates: config.styles.normalize.allowDuplicates
      })
    ])))
    .pipe(gulpif(config.styles.sourcemaps.generate === true, sourcemaps.write(config.styles.sourcemaps.location, {
      addComment: config.styles.sourcemaps.addcomment,
      includeContent: config.styles.sourcemaps.includeContent,
      sourceRoot: function (file) {
        return '../'.repeat(file.relative.split('\\').length) + 'src';
      },
      destPath: config.styles.sourcemaps.destpath,
      sourceMappingURLPrefix: config.styles.sourcemaps.sourcemappingurlprefix,
      debug: config.styles.sourcemaps.debug,
      charset: config.styles.sourcemaps.charset
    })))
    .pipe(gulp.dest(config.locations.styles.dist))
    .pipe(filter_sourcemaps)
    .pipe(gulpif(config.styles.minify === true, bytediff.start()))
    .pipe(gulpif(config.styles.minify === true, nano()))
    .pipe(gulpif(config.styles.minify === true, rename(function (path) {
      path.basename += '.min';
    })))
    .pipe(gulpif(config.styles.minify === true, gulp.dest(config.locations.styles.dist)))
    .pipe(gulpif(config.styles.minify === true, bytediff.stop()))
    .pipe(gulpif(config.styles.gzip === true, bytediff.start()))
    .pipe(gulpif(config.styles.gzip === true, gzip()))
    .pipe(gulpif(config.styles.gzip === true, gulp.dest(config.locations.styles.dist)))
    .pipe(gulpif(config.styles.gzip === true, bytediff.stop()))
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
    .pipe(plumber.stop());
}


//SASSlinter validates your SCSS
function lint() {
  return gulp.src([config.locations.styles.src + '/' + '**/*.s+(a|c)ss', '!' + config.locations.styles.libraries + '/**/*'])
    .pipe(sassLint({
      options: {},
      config: config.styles.linter.config
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
        fs.readFile(config.locations.styles.dist + file, 'utf8', function (err,data) {
          if (err) {
            return log(err);
          }
          log(file);
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
        fs.readFile(config.locations.styles.dist +  file, 'utf8', function (err,data) {
          if (err) {
            return log(err);
          }
          log(file);
          console.log(cssstats(data));
        });
      }
    });
  });
}
/*---------------------------------------------------------------------------------------------------*/

/*Browsersync-----------------------------------------------------------------------------------------*/
function bs(mode, settings) {
  browserSync.init(settings, function(err, bs){
    var port = (bs.server._connectionKey).substr((bs.server._connectionKey).length - 4);
    var title = "Browsersync started",
        ip = 'localhost';
    if (mode === 'share'){
      title += " in share mode";
      ip = getIP();
    }
    notifier.notify({
      title: title,
      message: 'on ' + ip + ':' + port + '\nClick to launch browser',
      icon: path.join(__dirname, config.general.logopath),
      sound: config.general.sound,
      wait: true
    });
    notifier.on('click', function (notifierObject, options) {
      open("http://" + ip + ":" + port);
    });
  });
}


function browsersync() {
  console.log(config.general.projectpath);
  var settings = {
    open: config.browsersync.open,
    proxy: config.general.projectpath,
    logLevel: config.browsersync.loglevel,
    logFileChanges: config.browsersync.logfilechanges
  };
  bs('regular', settings);
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
  bs('share', settings);
}

// Bootstrap - generate bootstrap javascript file, also uglified
function bootstrap() {
  var bootstrap = [config.locations.javascript.libraries + '/bootstrap/util.js'];
  for (var prop in config.js.bootstrap.files) {
    if (config.js.bootstrap.files[prop]) {
      var path = config.locations.javascript.libraries + '/bootstrap/' + prop + '.js';
      if (prop === 'tooltip') {
        if (config.js.bootstrap.version === '4.0.0-beta'){
          bootstrap.push(config.locations.javascript.libraries + '/popper.js/popper.js');
        } else {
          bootstrap.push(config.locations.javascript.libraries + '/tether/tether.js');
        }
      }
      bootstrap.push(path);
    }
  }
  return gulp.src(bootstrap)
    .pipe(plumber())
    .pipe(gulpif(config.js.sourcemaps.generate == true, sourcemaps.init({
      loadMaps: config.js.sourcemaps.loadmaps,
      identityMap: config.js.sourcemaps.identitymap,
      debug: config.js.sourcemaps.debug
    })))
    .pipe(order(bootstrap, {base: './'}))
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
      optimizeImage(basePath + file + '**/*', config.locations.images.dist + file);
      if (config.images.webp.use) {
          convertWebP(basePath + file + '**/*', config.locations.images.dist + file);
        }
      }
    });
    optimizeImage(basePath + '*.*', config.locations.images.dist);
    if (config.images.webp.use) {
      convertWebP(basePath + '*.*', config.locations.images.dist);
    }
  });
}

function optimizeImage(path, dest) {
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
/*---------------------------------------------------------------------------------------------------*/

/*Libraries------------------------------------------------------------------------------------------*/
function libraries(cb) {
  var libraryConfig = require('./libraries.json');
  var mode = libraryConfig['dependency-manager'];
  var libraryFlatten = libraryConfig.flatten;
  var libaryPath;
  var dependencies;
  var types = Object.keys(libraryConfig.types);
  var doneCounter = 0;
  var ignoreList = ['**', '!**/Gruntfile.js', '!**/grunt/**', '!**/gulpfile.js', '!**/tests/**', '!**/bs-config.js', '!**/eyeglass-exports.js']

  if (mode === 'bower') {
    var bower = require('./bower.json');
    libaryPath = 'bower_components';
    dependencies = Object.keys(bower.dependencies);
  } else {
    var pkg = require('./package.json');
    libaryPath = 'node_modules';
    dependencies = Object.keys(pkg.dependencies);
  }

  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter >= types.length) {
      done();
    }
  }

  var addToLibConfig = libraryConfig.libraries;
  dependencies.forEach(function (lib) {
    types.forEach(function (type) {
      var libDest = libraryConfig.types[type].path + '/' + lib;
      var allowFileType;
      var files = [libaryPath + '/' + lib + '/**/*.' + type];
      if (libraryConfig.libraries[lib] !== undefined) {
        if (libraryConfig.libraries[lib].destination !== undefined) {
          if (typeof libraryConfig.libraries[lib].destination === 'string') {
            libDest = libraryConfig.libraries[lib].destination
          } else if (libraryConfig.libraries[lib].destination[type] !== undefined) {
            libDest = libraryConfig.libraries[lib].destination[type];
          }
        }
        if (libraryConfig.libraries[lib].types[type] !== undefined && libraryConfig.libraries[lib].types[type] !== '') {
          allowFileType = libraryConfig.libraries[lib].types[type];
        } else {
          allowFileType = libraryConfig.types[type].allow;
        }
        if (libraryConfig.libraries[lib].files !== undefined) {
          if (typeof libraryConfig.libraries[lib].files === 'object') {
            if (libraryConfig.libraries[lib].files[type] !== undefined) {
              var srcFiles = libraryConfig.libraries[lib].files[type];
              files = [];
              srcFiles.forEach(function (file) {
                files.push(libaryPath + '/' + lib + '/' + file);
              });
            }
          } else {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(libraryConfig.libraries[lib].files)[1];
            var lastChar = (libraryConfig.libraries[lib].files).slice(-2);
            var allowedTypes = [];
            _.each( libraryConfig.libraries[lib].types, function( val, key ) {
              if ( val ) {
                allowedTypes.push(key);
              }
            });
            if ( _.indexOf(Object.keys(allowedTypes), ext) !== -1 ){
              files = [libaryPath + '/' + lib + '/' + libraryConfig.libraries[lib].files];
            } else if (lastChar === '/*') {
              files = [libaryPath + '/' + lib + '/' + libraryConfig.libraries[lib].files + '.' + type];
            } else {
              files = [libaryPath + '/' + lib + '/' + libraryConfig.libraries[lib].files + "/*." + type];
            }
          }
        }
        if (allowFileType === true) {
          if (libraryConfig.libraries[lib].flatten){
            libraryFlatten = libraryConfig.libraries[lib].flatten;
          }
          gulp.src(files)
            .pipe(filter(ignoreList, {restore: false}))
            .pipe(gulpif(libraryFlatten === true, flatten()))
            .pipe(gulp.dest(libDest))
            .pipe(synchro(incDoneCounter));
        }
      }
    });

    if (libraryConfig.libraries[lib] !== undefined) {
    } else {
      var data = {
        files: '**/*',
        types: {}
      };

      for (var l = 0; l < types.length; l++) {
        data.types[types[l]] = false;
      }
      addToLibConfig[lib] = data;
    }
  });
  var file = './libraries.json';
  libraryConfig.libraries = addToLibConfig;
  jsonfile.writeFile(file, libraryConfig, {spaces: 2}, function(err) {
    if (err) {
      log(chalk.red(err))
    }
  });
  cb();
}
/*---------------------------------------------------------------------------------------------------*/

/*Helper---------------------------------------------------------------------------------------------*/
function error(err, task){
  log(chalk.cyan(task + " Error") + " " + chalk.red(err.message));
  var message;
  if (err.relativePath) {
    message = "Error in " + err.relativePath
  } else {
    message = err.message;
  }
  notifier.notify({
    title: task + ' Error',
    message: message,
    icon: path.join(__dirname, config.general.logopath),
    sound: true, // Only Notification Center or Windows Toasters
    wait: true, // Wait with callback, until user action is taken against notification
    type: 'error'
  });
}

function getIP() {
  var ip = [];
  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return; // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      }
      ip.push(iface.address);
    });
  });
  return ip[0];
}

function deleteFile(path) {
  console.log('Removing file: ' + path);
  return gulp.src(path, {read: false})
    .pipe(clean());
}

function synchro(done) {
  return through2.obj(function (data, enc, cb) {
    cb();
  },
  function (cb) {
    cb();
    done();
  });
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
exports.bootstrap = bootstrap;
bootstrap.description = 'Generate Bootstap JS';
exports.watchFiles = watchFiles;
watchFiles.description = 'Watch for file changing';
exports.images = images;
images.description = 'Optimize Images';
exports.cssStats = cssStats;
cssStats.description = 'Statistics about your CSS';
exports.libraries = libraries;
libraries.description = 'Get necessary library files';

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
gulp.task('bootstrap', bootstrap);
gulp.task('js', js);
gulp.task('watch--files-only', watchFiles);
gulp.task('watch', watch);
gulp.task('images', images);
gulp.task('stats', cssStats);
gulp.task('libraries', libraries);