/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/*jshint node: true*/
module.exports = function (grunt) {
   'use strict';

   var pkg = grunt.file.readJSON('package.json');
   var bwr = grunt.file.readJSON('bower.json');
   var src = {
      gruntfile: 'Gruntfile.js',
      require: 'require_config.js',
      laxar_uikit: [pkg.name + '.js', 'lib/**/*.js', '!lib/**/spec/**/*.js', 'controls/**/*.js', '!controls/**/spec/**/*.js' ],
      specs: ['lib/**/spec/**/*.js', 'controls/**/spec/*.js'],
      docs: ['docs/**/*.md']
   };

   function karma(control) {
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

      return { options: options };
   }

   grunt.initConfig({
      jshint: {
         options: {
            jshintrc: '.jshintrc'
         },
         gruntfile: {
            options: { node: true },
            src: src.gruntfile
         },
         laxar_uikit: { src: src.laxar_uikit },
         specs: { src: src.specs }
      },
      requirejs: {
         laxar_uikit: {
            options: {
               baseUrl: './',
               mainConfigFile: src.require,
               optimize: 'uglify2',
               preserveLicenseComments: false,
               generateSourceMaps: true,
               exclude: [
                  'angular',
                  'jquery',
                  'underscore',
                  'q_mock'
               ],
               name: pkg.name,
               out: 'dist/' + pkg.name + '.js'
            }
         }
      },
      karma: {
         options: {
            basePath: '.',
            frameworks: ['laxar'],
            reporters: ['junit', 'coverage', 'progress'],
            browsers: ['PhantomJS'],
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
         laxar_uikit: {
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
         'controls-input': karma('input'),
         'controls-i18n': karma('i18n'),
         'controls-layer': karma('layer')
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
      markdown: {
         docs: {
            files: [ {
               expand: true,
               src: src.docs,
               dest: 'dist/',
               ext: '.html',
               rename: function (dest, src) {
                  return dest + src.replace(/\/README\.html$/, '/index.html');
               }
            } ]
         }
      },
      bower: {
         laxar_uikit: {
            rjsConfig: src.require,
            options: {
               baseUrl: './'
            }
         }
      },
      watch: {
         gruntfile: {
            files: src.gruntfile,
            tasks: ['jshint:gruntfile']
         },
         laxar_uikit: {
            files: src.laxar_uikit,
            tasks: ['jshint:laxar_uikit', 'karma']
         },
         specs: {
            files: src.specs,
            tasks: ['jshint:specs', 'karma']
         },
         docs: {
            files: src.docs,
            tasks: ['markdown']
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-requirejs');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-bower-requirejs');
   grunt.loadNpmTasks('grunt-laxar');
   grunt.loadNpmTasks('grunt-markdown');

   grunt.registerTask('build', ['requirejs']);
   grunt.registerTask('test', ['karma', 'test_results_merger', 'lcov_info_merger', 'jshint']);
   grunt.registerTask('default', ['build', 'test']);
};
