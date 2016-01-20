/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/*jshint node: true*/
module.exports = function( grunt ) {
   'use strict';

   var pkg = grunt.file.readJSON( 'package.json' );

   grunt.initConfig( {
      pkg: pkg,
      pkgFile: 'package.json',
      karma: {
         options: {
            browsers: [ 'PhantomJS' ],
            plugins: [
               'karma-systemjs',
               'karma-jasmine',
               'karma-coverage',
               'karma-junit-reporter',
               'karma-phantomjs-launcher'
            ],
            reporters: [ 'progress', 'coverage', 'junit' ],
            preprocessors: {
               'lib/*.js': [ 'coverage' ]
            },
            junitReporter: {
               outputDir: 'karma-output/'
            },
            coverageReporter: {
               type : 'lcov',
               dir : 'karma-output/',
               // configure the reporter to use isparta for JavaScript coverage
               // Only on { "karma-coverage": "douglasduteil/karma-coverage#next" }
               instrumenters: { isparta: require( 'isparta' ) },
               instrumenter: {
                  '**/*.js': 'isparta'
               },
               instrumenterOptions: {
                  isparta: { babel: { presets: 'es2015' } }
               }
            },
            frameworks: [ 'systemjs', 'jasmine' ],
            systemjs: {
               configFile: 'system.config.js',
               serveFiles: [
                  'lib/**/*.js',
                  'jspm_packages/**/*.js',
               ],
               config: {
                  paths: {
                     'babel': 'node_modules/babel-core/browser.js',
                     'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
                     'phantomjs-polyfill': 'node_modules/phantomjs-polyfill/bind-polyfill.js',
                     'systemjs': 'node_modules/systemjs/dist/system.js',
                     'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
                  }
               }
            }
         },
         unit: {
            singleRun: true,
            files: [ {
               src: 'lib/spec/*_spec.js'
            } ]
         }
      },
      eslint: {
         options: {
            config: '.eslintrc'
         },
         src: [ 'lib/**/*.js' ]
      },
      clean: {
         apidoc: {
            src: [ 'docs/api/*.js.md' ]
         }
      },
      laxar_dox: {
         default: {
            files: [ {
               src: [
                  'lib/!(moment_formats|number_formats).js'
               ],
               dest: 'docs/api/'
            } ]
         }
      }

   } );

   grunt.loadNpmTasks( 'grunt-contrib-clean' );
   grunt.loadNpmTasks( 'grunt-karma' );
   grunt.loadNpmTasks( 'gruntify-eslint' );

   grunt.registerTask( 'test', [ 'eslint', 'karma' ] );
   grunt.registerTask( 'apidoc', [ 'clean:apidoc', 'laxar_dox' ] );

   grunt.registerTask( 'default', [ 'test', 'apidoc' ] );

};
