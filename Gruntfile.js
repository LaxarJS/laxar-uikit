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
         files: [
            { pattern: 'bower_components/**', included: false },
            { pattern: 'lib/**', included: false },
            { pattern: 'controls/**', included: false},
         ],
         laxar: {
            specRunner: 'controls/' + control + '/spec/spec_runner.js',
            requireConfig: src.require
         },
         junitReporter: {
            outputFile: 'controls/' + control + '/junit.xml'
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
            reporters: ['junit', 'progress'],
            browsers: ['PhantomJS'],
            singleRun: true
         },
         laxar_uikit: {
            options: {
               files: [
                  { pattern: 'bower_components/**', included: false },
                  { pattern: 'lib/**', included: false }
               ],
               laxar: {
                  specRunner: 'lib/spec/spec_runner.js',
                  requireConfig: src.require
               },
               junitReporter: {
                  outputFile: 'lib/junit.xml'
               }
            }
         },
         'controls-input': karma('input'),
         'controls-layer': karma('layer')
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
   grunt.registerTask('test', ['karma', 'jshint']);
   grunt.registerTask('default', ['build', 'test']);
};
