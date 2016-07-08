// Karma configuration for LaxarJS core
/* eslint-env node */

const webpackConfig = Object.assign( {}, require('./webpack.base.config' ) );
delete webpackConfig.entry[ 'laxar-uikit' ];
delete webpackConfig.plugins;
webpackConfig.devtool = 'inline-source-map';
const polyfillPath = require.resolve( 'laxar/dist/polyfills' );

module.exports = function(config) {
   const browsers = [ 'PhantomJS', 'Firefox' ].concat( [
      process.env.TRAVIS ? 'ChromeTravisCi' : 'Chrome'
   ] );

   config.set( {
      frameworks: [ 'jasmine' ],
      files: [
         polyfillPath,
         'lib/spec/spec-runner.js'
      ],
      preprocessors: {
         '**/spec/spec-runner.js': [ 'webpack', 'sourcemap' ]
      },
      webpack: webpackConfig,

      reporters: [ 'progress', 'junit' ],
      junitReporter: {
         outputDir: 'karma-output/'
      },
      port: 9876,
      browsers: browsers,
      customLaunchers: {
         ChromeTravisCi: {
            base: 'Chrome',
            flags: [ '--no-sandbox' ]
         }
      },
      browserNoActivityTimeout: 100000,
      singleRun: true,
      autoWatch: false,
      concurrency: Infinity
   } );
};
