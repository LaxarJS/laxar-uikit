/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'jquery',
   'trunk8'
], function( ng, $ ) {
   'use strict';

   var directiveName = 'axTextEllipsis';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directive = [ function() {
      console.log( 'provide text ellipsis' );
      return {
         restrict: 'A',
         link: function link( scope, iElement, iAttrs ) {
            console.log( 'link text ellipsis' );
            var $subject = $( iElement[ 0 ] );
            if( iAttrs.axTextEllipsis ) {
               var config = scope.$eval( iAttrs.axTextEllipsis );
               $subject.trunk8( config );
            }
            else {
               $subject.trunk8();
            }
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.directive( directiveName, directive );
      }
   };

} );
