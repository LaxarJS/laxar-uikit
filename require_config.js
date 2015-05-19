var require = {
   baseUrl: './',
   shim: {
      angular: {
         deps: [
            'jquery'
         ],
         exports: 'angular'
      },
      'angular-mocks': {
         deps: [
            'angular'
         ],
         init: function ( angular ) {
            'use strict';
            return angular.mock;
         }
      },
      'angular-route': {
         deps: [
            'angular'
         ],
         init: function ( angular ) {
            'use strict';
            return angular.route;
         }
      },
      'angular-sanitize': {
         deps: [
            'angular'
         ],
         init: function ( angular ) {
            'use strict';
            return angular;
         }
      },
      'bootstrap-affix': {
         deps: [
            'jquery'
         ]
      },
      'bootstrap-tooltip': {
         deps: [
            'jquery'
         ]
      },
      'trunk8': {
         deps: [
            'jquery'
         ]
      }
   },
   packages: [
      {
         name: 'laxar',
         location: 'bower_components/laxar',
         main: 'laxar'
      },
      {
         name: 'laxar_uikit',
         location: '.',
         main: 'laxar_uikit'
      },
      {
         name: 'moment',
         location: 'bower_components/moment',
         main: 'moment'
      }
   ],
   paths: {
      'bootstrap-tooltip': 'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip',
      'bootstrap-affix': 'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/affix',
      text: 'bower_components/requirejs-plugins/lib/text',
      requirejs: 'bower_components/requirejs/require',
      jjv: 'bower_components/jjv/lib/jjv',
      jjve: 'bower_components/jjve/jjve',
      json: 'bower_components/requirejs-plugins/src/json',
      jquery: 'bower_components/jquery/dist/jquery',
      'angular-route': 'bower_components/angular-route/angular-route',
      'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
      'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
      angular: 'bower_components/angular/angular',
      trunk8: 'bower_components/trunk8/trunk8',
      jquery_ui: 'bower_components/jquery_ui/ui',
      q_mock: 'bower_components/q_mock/q',

      jasmine: 'bower_components/jasmine/lib/jasmine-core/jasmine'
   }
};
