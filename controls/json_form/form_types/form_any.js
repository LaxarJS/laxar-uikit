/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular'
], function( ng ) {
   'use strict';

   var directiveName = 'axJsonFormAny';

   var directive = [
      function() {
         return {
            scope: {
               schema: '=axSchema',
               data: '=axData',
               messages: '=axMessages',
               formConfiguration: '=axFormConfiguration'
            },
            template: '<div><textarea data-ng-model="dataAsJson"></textarea>' +
               '<i class="icon-warning-sign" title="{{ messages.NOT_UPDATING_THE_MODEL }}"></i>' +
               '</div>',
            replace: true,
            link: function( scope, element, attrs ) {
               var lastReceivedData;

               scope.$watch( 'data', function() {
                  element.children( 'i' ).hide();
                  scope.dataAsJson = JSON.stringify( scope.data, null, 3 );
                  lastReceivedData = JSON.parse( scope.dataAsJson );
               } );

               scope.$watch( 'dataAsJson', function( newValue, oldValue ) {
                  element.children( 'i' ).hide();
                  try {
                     var parsed;
                     parsed = JSON.parse( newValue );
                     if( ng.equals( parsed, lastReceivedData ) ) {
                        return;
                     }
                     lastReceivedData = parsed;
                     scope.data = parsed;
                  }
                  catch( e ) {
                     element.children( 'i' ).show();
                  }

               } );
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