/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [], function() {
   'use strict';

   var directiveName = 'axJsonFormBoolean';

   var directive = [
      function() {
         return {
            scope: {
               schema: '=axSchema',
               data: '=axData',
               messages: '=axMessages',
               formConfiguration: '=axFormConfiguration'
            },
            template: '<input type="checkbox" data-ng-model="data">',
            replace: true,
            link: function( scope ) {
               if( typeof scope.data !== 'boolean' && scope.schema['default'] ) {
                  scope.data = scope.schema['default'];
               }
            }
         };
      }
   ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      register: function( module ) {
         module.directive( directiveName, directive );
      }
   };

} );