/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'jquery'
], function( ng ) {
   'use strict';

   var module = ng.module( 'axPageFade', [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directiveName = 'axPageFade';
   var directive =[ '$window', 'axGlobalEventBus', function( $window, eventBus ) {
      return function( scope, element ) {
         eventBus.subscribe( 'didNavigate', function() {
            $window.setTimeout( function() {
               element.fadeOut( 'fast' );
            }, 100 );
         } );

         eventBus.subscribe( 'endLifecycleRequest', function() {
            element.css( 'display', 'block' );
         } );
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.directive( directiveName, directive );
      }
   };

} );
