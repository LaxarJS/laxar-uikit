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

   function karma( control ) {
      var options = {
         laxar: {
            specRunner: 'controls/' + control + '/spec/spec_runner.js',
            requireConfig: src.require
         },
         junitReporter: {
            outputFile: 'controls/' + control + '/spec/test-results.xml'
         },
         coverageReporter: {
            type: 'lcovonly',
            dir: 'controls/' + control + '/spec',
            file: 'lcov.info'
         }
      };

      return {options: options};
   }

   grunt.initConfig( {
      jshint: {
         options: {
            jshintrc: '.jshintrc'
         },
         gruntfile: {
            options: { node: true },
            src: src.gruntfile
         },
         'laxar-uikit': { src: src[ pkg.name ] },
         specs: { src: src.specs }
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
         },
         'controls-input': karma( 'input' ),
         'controls-i18n': karma( 'i18n' ),
         'controls-layer': karma( 'layer' )
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
      }
   } );

   grunt.loadNpmTasks( 'grunt-contrib-jshint' );
   grunt.loadNpmTasks( 'grunt-contrib-watch' );
   grunt.loadNpmTasks( 'grunt-laxar' );

   grunt.registerTask( 'test', [ 'karma', 'test_results_merger', 'lcov_info_merger', 'jshint' ] );
   grunt.registerTask( 'default', [ 'test' ] );
};
