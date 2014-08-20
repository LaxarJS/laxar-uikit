/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar'
], function( ax ) {
   'use strict';

   function emptyDefaultByType( type ) {
      switch( type ) {
         case 'boolean':
            return false;

         case 'string':
            return '';

         case 'any':
            // "any" is treated as a simple JSON string, thus allowing anything :)
            return null;

         case 'number':
         case 'integer':
            return 0;

         case 'array':
            return [];

         case 'object':
            return {};

         default:
            if( Object.prototype.toString.call( type ) === '[object Array]' ) {
               // For now we don't support alternating types and instead let the user input some JSON directly
               return null;
            }
            ax.log.warn( 'Cannot determine empty default for unknown type [0]. Assuming any.', type );
            return null;
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var warningIconDirectiveName = 'axWarningIcon';
   var warningIconDirective = [
      function() {
         return {
            restrict: 'A',
            template: '<i class="fa ax-icon-warn" title=""></i>',
            replace: true,
            link: function( scope, element, attrs ) {
               scope.$watch( attrs[ warningIconDirectiveName ], function( newValue ) {
                  newValue = newValue || [];
                  element.attr( 'title', newValue.join( ' ' ) );
                  element.css( 'visibility', newValue.length ? 'visible' : 'hidden' );
               } );
            }
         };
      }
   ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      emptyDefaultByType: emptyDefaultByType,

      registerDirectives: function( module ) {
         module.directive( warningIconDirectiveName, warningIconDirective );
      }
   };

} );