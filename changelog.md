_Gulp for Drupal Changelog version 2.6.0 2017-05-23_


#### included Gulp files:
    - gulpfile.js       (4.1.0) (2017-09-26)
    - gulpconfig.json   (4.0.0) (2017-09-26)
    - package.json      (4.0.0) (2017-09-26)
    - libraries.json    (1.0.1) (2017-10-05)
    - .sass-lint.yml    (1.0.1) (2016-06-24)
    - bower.json        (1.4.1) (2016-10-05)

#### 2017-10-05 - Updated Default Settings
    - Removed normalize.css as default dependency, switch to bootstrap reboot (still posible to use normalize by running: bower install normalize.css --save)
    - Set all bootstrap libraries to false
    - Configured default bootstrap files
    - set libraries flatten to false    

#### 2017-09-27 - Bugfix
    - Fixed bug in styles: exclude not working causing task to crash

#### 2017-09-26 - Added Libraries task, Normalize, localconfig
    - Added task to extract alle necessary library files from bower_components and node_modules
    - Added option to include normalize.css based on browsersupport
    - Changed default browsersupport
    - Added option to disable sounds (default disabled)
    - Added Twig to locations (It's Drupal after all)
    - Added option to locally overwrite the configuration
    - Replaced Gulp notify with notifier
    - Improved log messages (with color)
    - Added option to configure bootstrap version so popper.js is used for >4.0.0-beta
    - Readded Bower, Yarn / NPM does not install peerdependencies.
    
    
#### 2017-08-11 - Complete Update (V4)
    - Removed Bower (in favor of Yarn)
    - Added Yarn Libraries feature, with libraries.json config file
    - Rewrite to Gulp 4
    - Watch tasks configurable from config (add tasks to certain file types)
    - Brought back Image Optimize (when watched, images removed from source will also be removed from destination)
    - Added CSS stats task
    
    
#### 2017-05-23 - updated browsersync and uglifyjs
    - Updated Browsersync to 2.18.12
    - Updated Gulp-Uglify 3.0.0
 
#### 2017-05-19 - Removed references images and Colorblind
    - Removed all references to the previous colorblind and image optimize tasks
    
#### 2017-05-18 - Updated Modules
    - Updated Gulp Filter to 5.0.0
    - Updated Gulp-Autoprefixer to 4.0.0
    - Updated Gulp Notify to 3.0.0
    - Updated Gulp Postcss to 7.0.0
    - Updated Gulp Sass to 3.1.0
    - Updated Gulp Shell to 0.6.3
    - Updated Gulp Sourcemaps to 2.6.0
    - Updated Postcss to 6.0.1

#### 2017-03-14 - added Sass Glob Import
    - Added Sass Global Import
    Usable by @import folder/**
    
#### 2017-03-14 - removed jsLint
    - gulpfile.js
    - gulpconfig.json

#### 2017-03-14 - removed Colorblind modus
    - gulpfile.js
    - gulpconfig.json

#### 2017-03-14 - removed imageOptimize
    - gulpfile.js
    - gulpconfig.json

#### 2016-09-19 - Bugfix
    gulpfile.js 3.2.1
    
    - Fixed wrong bootstrap js path

#### 2016-09-19 - Removed getbootstrapcss
    gulpfile.js 3.2.0
    gulpconfig.json 2.10.0
    bower.json 1.2.0
    .gitignore 1.3.0
    README.md 1.8.1
    
    - Removed getbootstrapcss task (we use bower installer)
    - Changed Bower libraries destination
    - Added 'Advised ignores' to gitignore (just remove # to use)
    - merged js.libraries and libraries.path settings
    - removed references to mainscssfile setting
    

#### 2016-09-19 - Readme update
    README.md 1.8.0
    
    - Edited installation instructions

#### 2016-09-16 - Bootstrap Fixes
    gulpfile.js 3.1.1
    gulpconfig.json 2.9.2
    bower.json 1.1.1
    README.md 1.7.1
    
    - Removed bootstrap js path from config (no longer necessary)
    - Fixed default bootstrap settings
    - Changed bootrap version in bower.json to alpha 4

#### 2016-09-05 - Bower update
    bower.json 1.1.0
    .bowerrc 1.0.0
    gulpfile.js 3.0.1
    gulpconfig.json 2.9.1
    .gitignore 1.2.0
    README.md 1.7.0
    
    - use bower installer for managing bower files (install via 'npm install bower-installer -g')
    - moved static configuration to .bowerrc file (eg postinstall and ignore)
    - removed preen
    - changed bootstrap gulp tasks to new library folder
    - added bower_components to gitignore
    - Added bower configuration instructions to readme
    
    NOTES: Make sure you install bower-installer globally ('npm install bower-installer -g'). 
    after 'bower install' bower installer wil run to copy al necessary files to your library folder. 
    To configure the library folder edit the base inside bower.json. 
    if you want different files from your bower component add to install - sources in bower.json 
    

#### 2016-09-01 - Variable cleanup
    gulpfile.js 3.0.0
    
    - Changed variable configuration construction to use the configuration file directly
    - Removed unused variables
    - Restructured includes of plugins

#### 2016-09-01 - Image Optimize
    gulpfile.js 2.9.0
    gulpconfig.json 2.9.0
    README.md 1.6.0
    package.json 2.8.0
    
    - Changed imageoptimize jpegtran to jpegoptim
    - Changed imageoptimize optipng to pngquant
    - improved default settings
    - added ability to output webp images
    - added more configuration options to the plugins
    - fixed imagehandling by changing default image location setting


#### 2016-08-31 - Task cleanup
    gulpfile.js 2.8.0
    gulpconfig.json 2.8.0
    README.md 1.5.0
    package.json  2.7.0
    
    - Removed PSI task, use https://developers.google.com/speed/pagespeed/ instead
    - Removed cc-theme and cc-all tasks. you should use Drush to perform a cache clear
    - Removed packages: yargs, gulp util, del, psi
    - Removed unused variables
    - Removed unneccessary dependencies (work in progress)

#### 2016-08-29 - Bootstrap update
    gulpfile.js 2.7.0, 
    gulpconfig.json 2.7.0, 
    README.md 1.4.0, 
    package.json 2.6.0, 
    changelog.md 1.9.0, 
    bower.json 1.0.0
    
    - rewrite of bootstrapjs, now uses bower instead of NPM. 
    - bootstrap no long requires to run 3 commands. 
    - added configuration for bower
    - fixed bootstrap concat order by using gulp order module. 
    - fixed changelog document styling. 
    - updated readme with relevant data. 
    - added bower.json file

#### 2016-08-26 - Default settings
    gulpconfig.json 2.6.0, 
    README.md 1.3.1
    
    - Changed default settings for Gzip, minify, cacheclear and bootstrapjs to false
    - Fixed typo

#### 2016-08-15 - Exclude SCSS
    gulpfile 2.6.0, 
    gulpconfig 2.5.0
    
    - Added ability to exclude SCSS files from compiling
 
#### 2016-07-04 - Fix
    package.json 2.5.1
    
    - Fixed wrong package.json name and changed license and repository to Github settings
 
#### 2016-07-04 - Renaming
    Gulpfile.js 2.5.1, 
    gulpconfig.json 2.4.1, 
    README.md 1.2.2
    
    - Changed naming from "Synetic Gulp" to "Gulp for Drupal"
 
#### 2016-07-01 - Drupal ESlint
    .eslintrc 1.1.0, 
    README.md 1.2.1
    
    - Switched from .eslintrc.yml to .eslintrc ESlint configuration file.
    - Use Drupal ESlint settings
    
#### 2016-07-01 - Pa11y
    Gulpfile.js 2.5.0, 
    gulpconfig.json 2.4.0, 
    package.json 2.5.0, 
    README.md 1.2.0
    
    - Added Gulp Pa11y to do a accessibility audit.
    - Added Pa11y confiuration options to gulpconfig.json

#### 2016-06-30 - ESlint
    Gulpfile.js 2.4.0, 
    gulpconfig.json 2.3.0, 
    package.json 2.4.0, 
    README.md 1.1.0
    
    - Swithed to ESlint as a javaScript linter because of more configurablility options
    - removed JShint references and dependencies
    - swiched task name from gulp jshint to gulp jslint
    - Added .eslintrc.yml file for configuring ESlint
    - Added ESlint configuration documentation to readme
    
#### 2016-06-30 - .s+(a|c)ss
    Gulpfile.js 2.3.2, 
    gulpconfig.json 2.2.2
    
    - removed "sassversion" setting in favor of ".s+(a|c)ss" which supports both sass and scss at the same time

#### 2016-06-28 - Added Readme file
    README.md 1.0.0
    - created a readme file to explain the configuration and tasks of this gulpfile
    
#### 2016-06-28 - cleanup
    Gulpconfig.json 2.2.1
    - Removed unused settings
    
#### 2016-06-27 - fix
    Gulpfile.js 2.3.1
    
    - Fixed error in console when writing sourcemaps to external file.

#### 2016-06-27 - Parker
    Gulpfile.js 2.3.0, 
    gulpconfig.json 2.2.0, 
    package.json 2.3.0
    
    - Added Gulp Parker stylesheet analysis tool
        you can configure the report style and name in gulpconfig.json
        tasks: gulp parker
    - Removed synchronised deletion of dist and source files in gulp watch task because it was not reliable and not necessary with new directory structure.
    - Moved specificity graph to CSS section in Gulpfile.js
    - Removed CSScomb references
    - Fixed problem with CSS sourcemaps where gulp sass crashed on inludes of scss files outside the scss src folder
        Known Problems: no sourcemaps are added to minified files (minifier removes comments), error in console when creating external sourcemaps (Sourcemaps still work)
    - Added the same fix to JS sourcemaps to prevent future problems
    - Added extra configuration options to CSS and JS sourcemaps
    - Fixed a typo in csssourcemaps variable
    
 
#### 2016-06-24 - fix
    Gulpfile.js 2.2.2, 
    gulpconfig.json 2.1.1, 
    .sass-lint.yml 1.0.1
    
    - Fixed sourcemaps by removing production flag option
    - Added prevalence of the colorblindness variations to the table.
 
#### 2016-06-23 - Colorblind table
    Gulpfile.js 2.2.1, 
    package.json 2.2.1
    
    - Added a table to Gulp colorblind to display the colorblind variations
    - package.json added new package
        - cli-table


#### 2016-06-23 - Colorblind
    Gulpfile.js 2.2.0, 
    package.json 2.2.0
    
    - Added Postcss colorblind
        used gulp prompt to display an inquiry about the colorblind setting
    - Changed the way CSS is minified and gzipt. When enabled it will create a seperate style.min.css file and style.min.css.gz file
    - Removed the NoMinify flag on gulp sass, not necessary with new minify method.
    - package.json added new packages
        - postcss
        - postcss-colorblind
        - gulp-prompt
        - hexa-color-regex


#### 2016-06-21 - sasslint
    Gulpfile.js 2.1.0, 
    gulpconfig.json 2.1.0, 
    package.json 2.1.0
    
    - SASS linter added
        - task: gulp sasslint
    - package.json added:
        - gulp-sass-linter

#### 2016-06-15 - Modernizr settings + gZip
    Gulpfile.js 2.0.0, 
    gulpconfig.json 2.0.0
    
    - Changed file structure
    - Changed gulpconfig.json setting structure
    - Removed Copy tasks
    - Removed production arguments
    - Added ability to alway include or exclude modernizr functions (several are necessary for modernizr to work)
    - excluded JavaScript libraries from modernizr task
    - Included compatibility with sass compass for legacy code support
    - Added gZip ability to JavaScript and CSS files
        gulp-gzip
    - Added Checkdeps to check your npm dependencies for updates
    - Added ablility to configure which files to watch in watch task