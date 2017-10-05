# Gulp for Drupal
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Features](#features)
- [Installation](#installation)
- [Tasks](#tasks)
- [Configuration](#configuration)
  - [Gulpconfig.json](#gulpconfigjson)
  - [libaries.json](#libariesjson)
  - [.sass-lint.yml](#sass-lintyml)
- [SCSS/Sass Import](#scsssass-import)
- [Local Configuration](#local-configuration)
- [Watch](#watch)
- [Libraries](#libraries)
  - [Examples](#examples)
- [Included files](#included-files)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features
This gulp setup features a full Drupal Gulp workflow for proccesing your SCSS files, running browsersync, linting SCSS and JavaScript and several other tasks. This Gulp setup is made to work with Drupal (tested with Drupal 7 & 8) but can also be configured to work with any other project. The setup is extremely customisable by editing the `gulpconfig.json`.

## Installation
- Install [nodejs](https://nodejs.org/en/)
- Run `npm install gulp-cli yarn -g` in your terminal
- Move the files to your theme folder
- Run `yarn install`
- _Windows users should go to the `node_modules` folder and search for `.info` files and remove those_
- Install the [Browsersync module] (https://www.drupal.org/project/browsersync) and activiate this in your theme

## Tasks
|Task           |Function                                                   |
|---------------|-----------------------------------------------------------|
|default        |Run watch Task                                             |             
|bootstrap      |Generate Bootstap JS                                       |
|browsersync    |Serve files (with watching)                                |
|cd             |Check for Node Updates                                     |
|cr             |Clear Gulp Cache (for images)                              |
|images         |Optimize Images                                            |
|js             |Generate JS files (Bootstrap and Modernizr)                |
|libraries      |Get necessary library files                                |
|lint           |Lint SCSS                                                  |
|modernizr      |Generate Modenizr.js file based on CSS and JS              |
|parker         |Analyse your CSS files with parker                         |
|serve          |Compile SCSS and serve files (without watching)            |
|share          |Browsersync Server without Synchronising                   |
|sizereport     |Generate report of project size                            |
|stats          |Statistics about your CSS                                  |
|styles (sass)  |Compile SCSS                                               |
|watch          |Compile SCSS and serve files (with watching)               |
|watch--files-only|Watch for file changing                                  |

## Configuration
The gulp setup is made to be fully configurable by changing the settings in `gulpconfig.json`. If you change settings while running a task (eg. gulp watch), make sure you restart the task for the changes to work.
### Gulpconfig.json
 
|               |Setting                    | Explanation                                                                                                                              |
|---------------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
|               |allowLocalOverride         | Choose whether or not to allow a global configuration file to override the project config file                                           |
|**General**    |                           |                                                                                                                                          |
|               |projectpath                | Project folder root                                                                                                                      |
|               |logopath                   | Site logo - optional                                                                                                                     |
|**locations**  |**                         | Configure Source, destination and library destination for your files                                                                     |
|**styles**     |                           |                                                                                                                                          |
|               |browsersupport             | Which browsers to support with autoprefixer                                                                                              |
|               |minify                     | Want to minify your CSS?                                                                                                                 |
|               |gzip                       | Compress your CSS files using Gzip.                                                                                                      |
|               |compass                    | Allow use of compass functions?                                                                                                          |
|               |compass                    | Allow use of compass functions?                                                                                                          |
|               |exclude                    | Exclude SCSS / SASS files from stream                                                                                                    |
|_sourcemaps_   |sourcemaps                 | Want CSS sourcemaps?                                                                                                                     |      
|_sourcemaps_   |location                   | Where to put sourcemaps (keep empty to place inline)                                                                                     |
|_sourcemaps_   |loadmaps                   | Load existing sourcemaps                                                                                                                 |
|_sourcemaps_   |identitymap                | Set to true to generate a full valid source map encoding no changes                                                                      |
|_sourcemaps_   |debug                      | Get debug messages                                                                                                                       |
|_sourcemaps_   |addcomment                 | By default a comment containing / referencing the source map is added                                                                    |
|_sourcemaps_   |includecontent             | By default the source maps include the source code. Pass false to use the original files.                                                |
|_sourcemaps_   |charset                    | Sets the charset for inline source maps. Default: utf8                                                                                   |
|_sourcemaps_   |destpath                   | Set the destination path (the same you pass to gulp.dest()).                                                                             |
|_sourcemaps_   |sourcemappingurlprefix     | Specify a prefix to be prepended onto the source map URL when writing external source maps.                                              |
|_linter_       |config                     | Path to sass lint config file                                                                                                            |
|**js**         |                           |                                                                                                                                          |
|               |jspluginspath              | Where to put libraries as Modernizr and Bootstrap                                                                                        |
|_sourcemaps_   |sourcemaps                 | Generate Sourcemaps for JavaScript files (Bootstrap library)                                                                             |
|_sourcemaps_   |location                   | Where to put sourcemaps (keep empty to place inline)                                                                                     |
|_sourcemaps_   |loadmaps                   | Load existing sourcemaps                                                                                                                 |
|_sourcemaps_   |identitymap                | Set to true to generate a full valid source map encoding no changes                                                                      |
|_sourcemaps_   |debug                      | Get debug messages                                                                                                                       |   
|_sourcemaps_   |addcomment                 | By default a comment containing / referencing the source map is added                                                                    |
|_sourcemaps_   |includecontent             | By default the source maps include the source code. Pass false to use the original files.                                                |
|_sourcemaps_   |charset                    | Sets the charset for inline source maps. Default: utf8                                                                                   |
|_sourcemaps_   |destpath                   | Set the destination path (the same you pass to gulp.dest()).                                                                             |
|_sourcemaps_   |sourcemappingurlprefix     | Specify a prefix to be prepended onto the source map URL when writing external source maps.                                              |
|               |minify                     | Minify JavaScript, this removes comments, linebreaks and spaces                                                                          |
|               |gzip                       | Compress JavaScript using Gzip                                                                                                           |
|_bootstrap_    |**                         | True or false if you want to include these in your bootstrap.js file                                                                     |
|_modernizr_    |include                    | Which tests do you always want to include in modernizr (The default test are nessecary for modernizr to work correctly)                  |
|_modernizr_    |exclude                    | Exclude tests from your modernizr file, useful if you use the same classes                                                               |
|**images**     |**                         | Image optimize configuration                                                                                                             |
|**watch**      |**                         | Configure types to watch, you can turn sections on and of, configure extensions to watch and which tasks to run                          |
|**browsersync**|                           |                                                                                                                                          |
|               |open                       | Open Browsersync page after starting server                                                                                              |
|               |loglevel                   | Amount of Browsersync logging you want (debug, info or silent)                                                                           |
|               |logfilechanges             | Console notification on refresh (gives you multiple messages on every change)                                                            |
|**share**      |                           | Share can be used as a separate Browsersync session to share your work while working on it                                               |
|               |open                       | Open share page after starting server                                                                                                    |
|               |clicks                     | Sync clicks on share server                                                                                                              |
|               |forms                      | Sync forms on share server                                                                                                               |
|               |scroll                     | Sync Scrolling on share server                                                                                                           |
|               |port                       | Set port number for share server                                                                                                         |
|**quality**    |                           |                                                                                                                                          |
|_maxsize_      |**                         | General max size of files, used with gulp sizereport                                                                                     |

To watch more files, add a group to `watch`, set use to true, and enter the extensions. Please make sure you also add a group of the same name to `locations` and configure at least a source.
On file changes a Browsersync reload will be run by default, to add other tasks you can add `"tasks": []` with an array of tasks to any group.


### libaries.json
After adding libaries with `yarn add` or `npm install --save`, a section will be added to the libraries.json file. after configuring which files you would like, run `gulp libraries` to copy the library files to their location.
You can configure the source files, file types and destination per library. To configure a library specific destination path, add the following to the library configuration and set a destination per filetype.
` "destination": {
   "scss": "scss/libaries",
   "js": "js/libraries"
 }`

### .sass-lint.yml
The SASS / SCSS linter is configurable from a separate file, all the settings are described inside `.sass-lint.yml`.

## SCSS/Sass Import
You can import sass files with a wildcard. Use the following setup: 
`@import "folder/**";`

For second layer of folders use the following:
`@import "folder/**/*";`

## Local Configuration
It is posible to override the gulpconfig locally. If override is allowed (in `gulpconfig.json`), you can create a new `gulpconfig.local.json` file. In this you can add any setting from the gulpconfig. 

Example: 
```json
{ 
   "locations": {
     "styles": {
       "dist": "myowncssfolder/"
     }
   }
 }
 ``` 
 
## Watch
Like every part of Gulp-for-Drupal, the watch task is fully configurable. You can simply add or remove filegroups yourself. for each group, you can configure which file extensions should be watched and which tasks should be run. By default browsersync is run for all groups. Each group should also have at least the src configured under locations.

Example 
```
"watch" : {
  "styles" : { // Group name
    "use" : true, //Choose wheter or not to watch this group (especially handy while using a local config file)
    "extensions": ["scss", "sass"], // an array of extensions to watch
    "tasks" : ["styles", "lint"] // an array of gulp tasks to perform (Optional)
  }
}
``` 
## Libraries
The libraries task can be used to extract all neccessary files from libraries installed with Bower, NPM or Yarn. When running this task will look for any dependency configured in bower.json or package.json (bassed on your settings) and add these to libraries.json. For each library you can configure which files you want to copy, this can either be done by file type or as an single directory/file string (see examples). You have to set all file types you which to copy to true. By default each file will be copied to the path configured per file type and per library (eg css files go under css/libraries/bootstrap). You can specify different destinations per library (see examples).
It is possible to flatten the output so all files will be copied without the original folderstructure. To use this, the global setting can be used. This setting can be overwritten for each of the libraries (see examples).
### Examples
```json
  "bootstrap": {
      "files": {
        "js": [
          "js/dist/**/*.js"
        ],
        "scss": [
          "scss/**/*.scss"
        ]
      },
      "types": {
        "js": true,
        "scss": true,
        "css": false,
        "eot": true,
        "svg": true,
        "ttf": true,
        "woff": true,
        "map": false
      },
      "destination": {
        "scss": "libraries/scss",
        "js": "libraries/js"
      }
    }
```

```json
    "bootstrap": {
      "files": "dist/**/*",
      "flatten": true,
      "types": {
        "css": false,
        "js": true,
        "scss": true,
        "eot": false,
        "svg": false,
        "ttf": false,
        "woff": false,
        "map": false
      },
      "destination": "my-bootstrap"
    }
```
## Normalize.css
The Styles task can include normalize.css based on your browsersupport. To include this you need to enable normalize inside the ```gulpconfig.json``` and add ```@import-normalize;``` inside your scss file. 

## Included files
* gulpfile.js
* gulpconfig.json
* package.json
* libraries.json
* .sass-lint.yml
* .eslintrc
* .gitignore

_Created by Synetic_
_README.md updated on 2017-08-11 version 2.0.0_