/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'jquery',
   'bootstrap-affix'
], function( ng, $ ) {
   'use strict';

   var directiveName = 'axAffix';
   var attributeOffsetTop = directiveName + 'OffsetTop';
   var attributeOffsetBottom = directiveName + 'OffsetBottom';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directive = [ function() {

      return {
         restrict: 'A',
         link: function( scope, element, attrs ) {
            var offset = {};
            if( attrs[ attributeOffsetTop ] ) {
               offset.top = parseInt( attrs[ attributeOffsetTop ] );
            }
            if( attrs[ attributeOffsetBottom ] ) {
               offset.bottom = parseInt( attrs[ attributeOffsetBottom ] );
            }

            element.affix( { offset: offset } );
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
