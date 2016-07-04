/*==========================================================================
 Gulp for Drupal Changelog version 1.6.1 2016-07-04
 ===========================================================================*/
Included Gulp files:
    - gulpfile.js       (2.5.1) (2016-07-04)
    - gulpconfig.json   (2.4.1) (2016-07-04)
    - package.json      (2.5.0) (2016-07-01)
    - .npmrc            (1.0.0) (2016-03-08)
    - .sass-lint.yml    (1.0.1) (2016-06-24)
    - .eslintrc         (1.1.0) (2016-07-01)
    - .gitignore        (1.1.0) (2016-06-24)
    - README.md         (1.2.2) (2016-07-04)

 2016-07-04 - package.json 2.5.1
    - Fixed wrong package.json name and changed license and repository to Github settings
 
 2016-07-04 - Gulpfile.js 2.5.1, gulpconfig.json 2.4.1, README.md 1.2.2
    - Changed naming from "Synetic Gulp" to "Gulp for Drupal"
 
 2016-07-01 - .eslintrc 1.1.0, README.md 1.2.1
    - Switched from .eslintrc.yml to .eslintrc ESlint configuration file.
    - Use Drupal ESlint settings
    
 2016-07-01 - Gulpfile.js 2.5.0, gulpconfig.json 2.4.0, package.json 2.5.0, README.md 1.2.0
    - Added Gulp Pa11y to do a accessibility audit.
    - Added Pa11y confiuration options to gulpconfig.json

 2016-06-30 - Gulpfile.js 2.4.0, gulpconfig.json 2.3.0, package.json 2.4.0, README.md 1.1.0
    - Swithed to ESlint as a javaScript linter because of more configurablility options
    - removed JShint references and dependencies
    - swiched task name from gulp jshint to gulp jslint
    - Added .eslintrc.yml file for configuring ESlint
    - Added ESlint configuration documentation to readme
    
 2016-06-30 - Gulpfile.js 2.3.2, gulpconfig.json 2.2.2
    - removed "sassversion" setting in favor of ".s+(a|c)ss" which supports both sass and scss at the same time

 2016-06-28 - README.md 1.0.0
    - created a readme file to explain the configuration and tasks of this gulpfile
    
 2016-06-28 - Gulpconfig.json 2.2.1
    - Removed unused settings
    
 2016-06-27 - Gulpfile.js 2.3.1
    - Fixed error in console when writing sourcemaps to external file.

 2016-06-27 - Gulpfile.js 2.3.0, gulpconfig.json 2.2.0, package.json 2.3.0
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
    
 
 2016-06-24 - Gulpfile.js 2.2.2, gulpconfig.json 2.1.1, .sass-lint.yml 1.0.1
    - Fixed sourcemaps by removing production flag option
    - Added prevalence of the colorblindness variations to the table.
 
 2016-06-23 - Gulpfile.js 2.2.1, package.json 2.2.1
    - Added a table to Gulp colorblind to display the colorblind variations
    - package.json added new package
        - cli-table


 2016-06-23 - Gulpfile.js 2.2.0, package.json 2.2.0
    - Added Postcss colorblind
        used gulp prompt to display an inquiry about the colorblind setting
    - Changed the way CSS is minified and gzipt. When enabled it will create a seperate style.min.css file and style.min.css.gz file
    - Removed the NoMinify flag on gulp sass, not necessary with new minify method.
    - package.json added new packages
        - postcss
        - postcss-colorblind
        - gulp-prompt
        - hexa-color-regex


 2016-06-21 - Gulpfile.js 2.1.0, gulpconfig.json 2.1.0, package.json 2.1.0
    - SASS linter added
        - task: gulp sasslint
    - package.json added:
        - gulp-sass-linter

 2016-06-15 - Gulpfile.js 2.0.0, gulpconfig.json 2.0.0
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