#Gulp for Drupal

##Features

This gulp setup features a full Drupal Gulp workflow for proccesing your SCSS files, running browsersync, linting SCSS and JavaScript, optimizing images and several other tasks. This Gulp setup is made to work with Drupal (tested with Drupal 7 & 8) but can also be configured to work with any other project. The setup is fully configurable by customizing the settings in gulpconfig.json.

##Tasks
|Task           |Function                                                   |
|---------------|-----------------------------------------------------------|
|help           |Shows all available tasks                                  |             
|bootstrapjs    |Generate bootstrap javascript file, also uglified          |
|bower          |Install JavaScript Libraries via Bower                     |
|browsersync    |Run server with syncronized screens on multiple devices    |
|check-deps     |Check your dependencies                                    |
|clear          |Clear Gulp images Cache                                    |
|colorblind     |Simulate colorblindness, this overwrites your css files    |
|getbootstrapcss|Get Bootstrap SCSS files                                   |
|images         |Optimizes images (JPG, PNG, GIF and SVG)                   |
|jslint         |JavaScript lint tool                                       |
|jslibs         |Building JavaScript Libraries, Modernizr and Bootstrap.    |
|modernizr      |Create modernizr file from SCSS selectors and Javascript   |
|parker         |Analyse your CSS files with parker                         |
|pa11y          |Perform a accessibility Audit on your site                 |
|preen          |Remove unneeded files from bower components                |
|sass           |Compile Sass, create sourcemaps, autoprefix and minify.    |
|sasslint       |validate your SASS Aliases                                 |
|share          |Run server to share progress                               |
|sizereport     |Create a sizereport of your project                        |
|specificity    |Create a specificity graph for CSS                         |
|watch          |Watches for file changes and runs sass appropriately.      |

## Installation
Make sure you have installed [nodejs](https://nodejs.org/en/) and install gulp-cli globally `npm install gulp-cli -g`. After this move the gulpfiles to your drupal theme and run `npm install`, this will install all the necessary packages. After installation, Windows users should go to the `node_modules` folder and search for `.info` files and remove those, otherwise you wil get conflicts with Browsersync and several administation pages within Drupal.
To use browsersync with Drupal, you should install the [Browsersync module] (https://www.drupal.org/project/browsersync) and activiate this in your theme.
### Included files
* gulpfile.js
* gulpconfig.json
* package.json
* bower.json
* .npmrc
* .sass-lint.yml
* .eslintrc
* .gitignore

##Configuration
The gulp setup is made to be fully configurable by changing the settings in `gulpconfig.json`. If you change settings while running a task (eg. gulp watch), make sure you restart the task for the changes to work.
###Gulpconfig.json
 
|               |Setting                    | Explanation                                                                                                                              |
|---------------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
|**General**    |                           |                                                                                                                                          |
|               |projectpath                | Project folder root                                                                                                                      |
|               |logopath                   | Site logo - optional                                                                                                                     |
|               |themeroot                  | Root of the Drupal theme relative to your Gulpfile                                                                                       |
|**locations**  |                           |                                                                                                                                          |
|_src_          |scsspath                   | Location of your SCSS files                                                                                                              |
|_src_          |jspath                     | Location of your JavaScript files                                                                                                        |
|_src_          |imagespath                 | Location of your images                                                                                                                  |
|_src_          |fontspath                  | Location of your font files                                                                                                              |
|_src_          |iconspath                  | Location of your icon files                                                                                                              |
|_src_          |templatepath               | Path to PHP or Twig Template                                                                                                             |
|_src_          |functionspath              | Path to PHP Functions                                                                                                                    |
|_dist_         |csspath                    | Where to put CSS                                                                                                                         |
|_dist_         |jspath                     | Destination for JavaScript files                                                                                                         |
|_dist_         |imagespath                 | Where to put the images (WARNING: cannot be the same as src!!)                                                                           |
|**css**        |                           |                                                                                                                                          |
|               |mainscssfile               | Main scss/css file without extension                                                                                                     |
|               |browsersupport             | Which browsers to support with autoprefixer                                                                                              |
|               |minify                     | Want to minify your CSS?                                                                                                                 |
|               |gzip                       | Compress your CSS files using Gzip.                                                                                                      |
|               |compass                    | Allow use of compass functions?                                                                                                          |
|               |exclude                    | Exclude SCSS / SASS files from stream, ATTENTION: always have "**/*" as a first item in your array                                        |
|               |specificitygraphlocation   | Where to put Specificity Graph (if empty the folder will be: specificity-graph)                                                          |
|_eslint_       |configlocation             | path to your ESlint configuration file, default we supply a yml file but ESlint supports various formats                                 |
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
|_bootstrap_    |path                       |                                                                                                                                          |
|_linter_       |config                     | Path to sass lint config file                                                                                                            |
|_parker_       |log                        | Want to log the parker results in a external file                                                                                        |
|_parker_       |logname                    | Name the parkerlogfile                                                                                                                   |
|**js**         |                           |                                                                                                                                          |
|               |jslibspath                 | Where to put libraries as Modernizr and Bootstrap                                                                                        |
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
|_sourcemaps_   |minify                     | Minify JavaScript, this removes comments, linebreaks and spaces                                                                          |
|_sourcemaps_   |gzip                       | Compress JavaScript using Gzip                                                                                                           |
|_bootstrap_    |path                       |                                                                                                                                          |
|_bootstrap_    |alertjs, buttonjs, carouseljs, collapsejs, dropdownjs, popoverjs, scrollspyjs, tabjs, tooltipjs| True or false if you want to include these in your bootstrap.js file |
|_modernizr_    |alwaysinclude              | Which tests do you always want to include in modernizr (The default test are nessecary for modernizr to work correctly)                  |
|_modernizr_    |alwaysexclude              | Exclude tests from your modernizr file, useful if you use the same classes                                                               |
|**images**     |                           |                                                                                                                                          |
|_gif_          |interlaced                 | Interlace gif for progressive rendering|
|_gif_          |optimizationlevel          | Select optimization level between 1 and 3 (3 is better optimization but slower)|
|_jpeg_         |progressive                | Convert image to progressive image|
|_jpeg_         |max                        | Set max quality factor|
|_png_          |floyd                      | controls level of dithering (0 = none, 1=full)|
|_png_          |nofs                       | Disable Floyd-Steinberg dithering|
|_png_          |quality                    | Set quality factor between 0 and 100, like JPEG quality settings|
|_png_          |speed                      | Set speed between 0 and 10 (1 better optimization but slower, 10 is fastest)|
|_png_          |verbose                    | Print verbose messages|
|_webp_         |use                        | Enable WebP images (creates copies of your images in webp format)|
|_webp_         |preset                     | use a webp preset (default, photo, picture, drawing, icon and text)|
|_webp_         |quality                    | Select quality setting between 0 and 100|
|_webp_         |alphaQuality               | Set transparency-compression between 0 and 100|
|_webp_         |method                     | Set speed between 0 and 6 (6 better optimization but slower, 0 is fastest)|
|_webp_         |sns                        | Set the amplitude of spatial noise shaping between 0 and 100.|
|_webp_         |lossless                   | Encode images losslessly.|
|**libraries**  |                           | Installing libraries via Bower by running Gulp installlibs, this will add the libraries to your package.json                             |
|_bower_        |path                       | here to install bower components (default: bower_components)                                                                             |
|_bower_        |interactive                | enable prompting from bower                                                                                                              |
|_bower_        |verbosity                  | set verbosity level (0 = no output, 1 = error output, 2 = info)                                                                          |
|**taskconfig** |                           |                                                                                                                                          |
|               |watchtasks                 | Which tasks to run before gulp watch (Browsersync and SASS already included)                                                             |
|_watch_        |lintscss                   | Lint your SCSS                                                                                                                           |
|_watch_        |images                     | Process new or edited images                                                                                                             |
|_watch_        |javascript                 | Lint new or edited javascript files                                                                                                      |
|**browsersync**|                           |                                                                                                                                          |
|               |open                       | Open Browsersync page after starting server                                                                                              |
|               |loglevel                   | Amount of Browsersync logging you want (debug, info or silent)                                                                           |
|               |logfilechanges             | Console notification on refresh (gives you multiple messages on every change)                                                            |
|_watch_        |icons                      | Reload Browsersync on new,edited or removed icons                                                                                        |
|_watch_        |fonts                      | Reload Browsersync on new, edited or removed fonts                                                                                       |
|_watch_        |images                     | Reload Browsersync on new or edited images                                                                                               |
|_watch_        |javascript                 | Reload Browsersync JavaScript changes                                                                                                    |
|_watch_        |phpfunctions               | Reload Browsersync on changes inside the Functions folder                                                                                |
|_watch_        |template                   | Reload Browsersync on changes inside the Templates folder                                                                                |
|_watch_        |yaml                       | Reload Browsersync on changes to Yaml files                                                                                              |
|               |                           | Share can be used as a separate Browsersync session to share your work while working on it                                               |
|_share_        |open                       | Open share page after starting server                                                                                                    |
|_share_        |clicks                     | Sync clicks on share server                                                                                                              |
|_share_        |forms                      | Sync forms on share server                                                                                                               |
|_share_        |scroll                     | Sync Scrolling on share server                                                                                                           |
|_share_        |port                       | Set port number for share server                                                                                                         |
|**quality**    |                           |                                                                                                                                          |
|_maxsize_      |maxsize                    | General max size of files, used with gulp sizereport                                                                                     |
|_maxsize_      |css                        | Maximum size of CSS files                                                                                                                |
|_maxsize_      |js                         | Maximum size of JavaScript files                                                                                                         |
|_maxsize_      |images                     | Maximum size of Images files                                                                                                             |
|**accessibility**|                         |                                                                                                                                          |
|_pa11y_        |standard                   |The standard to use. One of Section508, WCAG2A, WCAG2AA, WCAG2AAA. Default WCAG2AA                                                        |
|_pa11y_        |failonerror                |Fail your build if there is any accessibility error                                                                                       |
|_pa11y_        |showfailedonly             |FOnly display the errors in report, Set to false to display errros, warnings and notice.                                                  |
|_pa11y_        |reporter                   |The reporter to use with Pa11y                                                                                                            |
|_pa11y_        |htmlcs                     |The URL to source HTML_CodeSniffer from                                                                                                   |
|_pa11y_        |config                     |The path to a JSON config file or a config object                                                                                         |
|_pa11y_        |timeout                    |he number of milliseconds before a timeout error occurs.                                                                                  |
###.sass-lint.yml
The SASS / SCSS linter is configurable from a separate file, all the settings are described inside `.sass-lint.yml`.

_Created by Synetic_
_README.md updated on 2016-09-01 version 1.6.0_