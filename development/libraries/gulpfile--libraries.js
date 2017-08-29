var
  libraryConfig = require('./libraries.json');
var updater = require('jsonfile-updater'),
  nodetree = require('nodetree');

/*Libraries------------------------------------------------------------------------------------------*/
var bower = require('./bower.json');
function libraries(cb) {
  var types = Object.keys(libraryConfig.types);
  var dependencies = Object.keys(bower.dependencies);
  var doneCounter = 0;
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
      var files = ['bower_components/' + lib + '/**/*.' + type];
      // console.log(lib);
      // console.log(libraryConfig.libraries[lib]);
      if (libraryConfig.libraries[lib] !== undefined) {
        var dest = libraryConfig.libraries[lib].destination;
        if (dest !== undefined) {
          if (dest[type] !== undefined) {
            libDest = dest[type];
          }
        }
        if (libraryConfig.libraries[lib].types[type] !== undefined && libraryConfig.libraries[lib].types[type] !== '') {
          allowFileType = libraryConfig.libraries[lib].types[type];
        } else {
          allowFileType = libraryConfig.types[type].allow;
        }
        if (libraryConfig.libraries[lib].files !== undefined) {
          if (libraryConfig.libraries[lib].files[type] !== undefined) {
            var srcFiles = libraryConfig.libraries[lib].files[type];
            files = [];
            srcFiles.forEach(function (file) {
              console.log(file);
              files.push('bower_components/' + lib + '/' + file);
            });
          }
        }
        if (allowFileType === true) {
          gulp.src(files)
            .pipe(filter(['**', '!**/Gruntfile.js', '!**/grunt/**', '!**/gulpfile.js', '!**/tests/**', '!**/bs-config.js', '!**/eyeglass-exports.js'], {restore: false}))
            .pipe(gulp.dest(libDest))
            .pipe(synchro(incDoneCounter));
        }
      }
    });
    if (libraryConfig.libraries[lib] !== undefined) {
      console.log("not undefined");
    } else {
      var data = {
        files: '',
        types: {}
      };
      console.log(lib);
      for (var l = 0; l < types.length; l++) {
        data.types[types[l]] = false;
      }
      addToLibConfig[lib] = data;
      // updater('./libraries.json').add('libraries.' + lib, data);
      // nodetree('./bower_components/' + lib + '/', {
      //   all: true,
      //   directories: false,
      //   prune: true,
      //   noreport: false
      // });
    }
  });
  updater('./libraries.json').update('libraries.test', addToLibConfig);
  cb();
}





/*---------------------------------------------------------------------------------------------------*/
// var exec = require('child_process').exec,
//   child;
// /*Libraries------------------------------------------------------------------------------------------*/
// function peerDependencies(lib) {
//
//   fs.stat('./node_modules/' + lib + '/package.json', function (err, stat) {
//     console.log(lib);
//     if(err == null) {
//       console.log("file exists" + lib);
//       fs.readFile('./node_modules/' + lib + '/package.json', 'utf8', function (err, data) {
//         if (err) throw err;
//         libraryPackage = JSON.parse(data);
//         console.log(libraryPackage.name);
//         if (libraryPackage.peerDependencies) {
//           console.log("peer exists");
//           var peer = Object.keys(libraryPackage.peerDependencies);
//           peer.forEach(function (item) {
//             console.log(item);
//             if (!package.dependencies[item]) {
//               console.log(libraryPackage.peerDependencies[item]);
//               console.log('yarn add ' + item + "@" + libraryPackage.peerDependencies[item]);
//               child = exec('yarn add ' + item + "@" + libraryPackage.peerDependencies[item],
//                 function (error, stdout, stderr) {
//                   // console.log('stdout: ' + stdout);
//                   console.log('stderr: ' + stderr);
//                   if (error !== null) {
//                     console.log('exec error: ' + error);
//                   }
//                 });
//
//             }
//           });
//           console.log(libraryPackage.peerDependencies);
//         }
//       });
//     } else {
//       console.log("file not exists");
//     }
//   } );
// }
//
// function libraries(cb) {
//   var types = Object.keys(libraryConfig.types);
//   var dependencies = Object.keys(package.dependencies);
//   var doneCounter = 0;
//   function incDoneCounter() {
//     doneCounter += 1;
//     if (doneCounter >= types.length) {
//       done();
//     }
//   }
//   for (var i = 0; i < dependencies.length; ++i) {
//     var lib = dependencies[i];
//
//     peerDependencies(lib);
//
//     for (var j = 0; j < types.length; ++j) {
//       var type = types[j];
//       var libDest = libraryConfig.types[type].path + '/' + lib;
//       var allowFileType;
//       var files = ['node_modules/' + lib + '/**/*.' + type];
//       if (libraryConfig.libraries[lib] !== undefined) {
//         var dest = libraryConfig.libraries[lib].destination;
//         if (dest !== undefined) {
//           if (dest[type] !== undefined) {
//             libDest = dest[type];
//           }
//         }
//         if (libraryConfig.libraries[lib].types[type] !== undefined && libraryConfig.libraries[lib].types[type] !== '') {
//           allowFileType = libraryConfig.libraries[lib].types[type];
//         } else {
//           allowFileType = libraryConfig.types[type].allow;
//         }
//         if (libraryConfig.libraries[lib].files !== undefined) {
//           if (libraryConfig.libraries[lib].files[type] !== undefined) {
//             var srcFiles = libraryConfig.libraries[lib].files[type];
//             files = [];
//             for (var k = 0; k < srcFiles.length; k++) {
//               files.push('node_modules/' + lib + '/' + srcFiles[k]);
//             }
//           }
//         }
//         if (allowFileType === true) {
//           gulp.src(files)
//             .pipe(filter(['**', '!**/Gruntfile.js', '!**/grunt/**', '!**/gulpfile.js', '!**/tests/**', '!**/bs-config.js', '!**/eyeglass-exports.js'], {restore: false}))
//             .pipe(gulp.dest(libDest))
//             .pipe(synchro(incDoneCounter));
//         }
//       } else {
//         var data = {
//           files: '',
//           types: {}
//         };
//         for (var l = 0; l < types.length; l++) {
//           var type = types[l];
//           data.types[type] = false;
//         }
//         updater('./libraries.json').add('libraries.' + lib, data);
//         nodetree('./node_modules/' + lib + '/', {
//           all: true,
//           directories: false,
//           prune: true,
//           noreport: false
//         });
//       }
//     }
//   }
//   cb();
// }

exports.libraries = libraries;
libraries.description = 'Get necessary library files';
gulp.task('libraries', libraries);