/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/*jshint node: true*/
module.exports = function( grunt ) {
   'use strict';

   var pkg = grunt.file.readJSON( 'package.json' );
   var src = {
      gruntfile: 'Gruntfile.js',
      require: 'require_config.js',
      'laxar-uikit': [
         pkg.name + '.js',
         'lib/**/*.js',
         '!lib/**/spec/**/*.js',
         'controls/**/*.js',
         '!controls/**/spec/**/*.js'
      ],
      specs: [ 'lib/**/spec/**/*.js', 'controls/**/spec/*.js' ]
   };

   grunt.initConfig( {
      eslint: {
         src: [ 'lib/*.js' ]
      },
      karma: {
         options: {
            basePath: '.',
            frameworks: [ 'laxar' ],
            reporters: [ 'junit', 'coverage', 'progress' ],
            browsers: [ 'PhantomJS' ],
            singleRun: true,
            preprocessors: {
               'lib/**/*.js': 'coverage'
            },
            proxies: {},
            files: [
               { pattern: 'bower_components/**', included: false },
               { pattern: 'lib/**', included: false },
               { pattern: 'controls/**', included: false },
               { pattern: '*.js', included: false }
            ]
         },
         'laxar-uikit': {
            options: {
               files: [
                  { pattern: 'bower_components/**', included: false },
                  { pattern: 'lib/**', included: false },
                  { pattern: '*.js', included: false }
               ],
               laxar: {
                  specRunner: 'lib/spec/spec_runner.js',
                  requireConfig: src.require
               },
               junitReporter: {
                  outputFile: 'lib/spec/test-results.xml'
               },
               coverageReporter: {
                  type: 'lcovonly',
                  dir: 'lib/spec',
                  file: 'lcov.info'
               }
            }
         }
      },
      test_results_merger: {
         laxar: {
            src: [ 'lib/spec/test-results.xml', 'controls/*/spec/test-results.xml' ],
            dest: 'test-results.xml'
         }
      },
      lcov_info_merger: {
         laxar: {
            src: [ 'lib/spec/*/lcov.info', 'controls/*/spec/*/lcov.info' ],
            dest: 'lcov.info'
         }
      },
      watch: {
         gruntfile: {
            files: src.gruntfile,
            tasks: [ 'jshint:gruntfile' ]
         },
         'laxar-uikit': {
            files: src[ pkg.name ],
            tasks: [ 'jshint:laxar-uikit', 'karma' ]
         },
         specs: {
            files: src.specs,
            tasks: [ 'jshint:specs', 'karma' ]
         }
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
   grunt.loadNpmTasks("grunt-contrib-eslint");
   grunt.loadNpmTasks( 'grunt-contrib-watch' );
   grunt.loadNpmTasks( 'grunt-laxar' );

   grunt.registerTask( 'test', [ 'karma', 'test_results_merger', 'lcov_info_merger', 'eslint' ] );
   grunt.registerTask( 'apidoc', [ 'clean:apidoc', 'laxar_dox' ] );

   grunt.registerTask( 'default', [ 'test', 'apidoc' ] );
};
