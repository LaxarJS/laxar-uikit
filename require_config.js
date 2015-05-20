var require = {
   baseUrl: './bower_components/',
   paths: {
      requirejs: 'requirejs/require',
      text: 'requirejs-plugins/lib/text',
      json: 'requirejs-plugins/src/json',

      'laxar': 'laxar/dist/laxar',
      'laxar/laxar_testing': 'laxar/dist/laxar_testing',

      'angular-route': 'angular-route/angular-route',
      'angular-sanitize': 'angular-sanitize/angular-sanitize',
      'angular-mocks': 'angular-mocks/angular-mocks',
      angular: 'angular/angular',

      jjv: 'jjv/lib/jjv',
      jjve: 'jjve/jjve',

      // LaxarJS testing
      jquery: 'jquery/dist/jquery',
      q_mock: 'q_mock/q',
      jasmine: 'jasmine/lib/jasmine-core/jasmine'
   },
   packages: [
      {
         name: 'laxar-uikit',
         location: '.',
         main: 'laxar-uikit'
      },
      {
         name: 'moment',
         location: 'moment',
         main: 'moment'
      }
   ],
   shim: {
      angular: {
         deps: [ 'jquery' ],
         exports: 'angular'
      },
      'angular-mocks': {
         deps: [ 'jquery' ],
         init: function ( angular ) {
            'use strict';
            return angular.mock;
         }
      },
      'angular-route': {
         deps: [ 'jquery' ],
         init: function ( angular ) {
            'use strict';
            return angular.route;
         }
      },
      'angular-sanitize': {
         deps: [ 'jquery' ],
         init: function ( angular ) {
            'use strict';
            return angular;
         }
      }
   }
};
