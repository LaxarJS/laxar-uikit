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

   /**
    * The text ellipsis directives can be used to truncate text in a more configurable way than css itself
    * can. It uses the jQuery trunk8 plugin found here: https://github.com/rviscomi/trunk8
    *
    * Copy of the settings section:
    * - fill (Default: `'&hellip;'`) The string to insert in place of the omitted text. This value may include
    *   HTML.
    * - lines (Default: `1`) The number of lines of text-wrap to tolerate before truncating. This value must
    *   be an integer greater than or equal to 1.
    * - side (Default: `'right'`) The side of the text from which to truncate. Valid values include 'center',
    *   'left', and 'right'.
    * - tooltip (Default: `true`) When true, the title attribute of the targeted HTML element will be set to
    *   the original, untruncated string. Valid values include true and false.
    * - width (Default: `'auto'`) The width, in characters, of the desired text. When set to 'auto', trunk8
    *   will maximize the amount of text without spilling over.
    *
    * There are three directives available:
    * `axTextEllipsis` can only be used for static content already
    * present at the DOM node the directive is set on. Settings can be passed as object (binding) to the
    * directive attribute.
    *
    * Both `axBindTruncated` and `axBindHtmlTruncated` can be used to dynamically bind a string to possibly be
    * truncated. The DOM node's content is ignored and only the bound value is rendered. Whereas the first one
    * can only bind simple text, the latter can also render HTML. Both take their settings via the value of
    * `axTruncationOptions` as object (binding).
    */


   var axTextEllipsisDirectiveName = 'axTextEllipsis';
   var axTextEllipsisDirective = [ function() {
      return {
         restrict: 'A',
         link: function link( scope, element, attrs ) {
            if( attrs.axTextEllipsis ) {
               var config = scope.$eval( attrs.axTextEllipsis );
               element.trunk8( config );
            }
            else {
               element.trunk8();
            }
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var truncationOptionsAttribute = 'axTruncationOptions';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var axBindTruncatedDirectiveName = 'axBindTruncated';
   var axBindTruncatedDirective = [ function() {
      return {
         restrict: 'A',
         link: function( scope, element, attr ) {

            var isTruncated = false;
            var options = getTruncationOptions( scope, attr );

            scope.$watch( attr[ axBindTruncatedDirectiveName ], function( value ) {
               if( value == null || value === '' ) {
                  // The check for '' is necessary due to a bug in trunk8.update
                  element.text( '' );
                  return;
               }

               if( !isNaN( options.width ) && value.length <= options.width ) {
                  // This explicit check prevents from triggering a bug in trunk8 plugin
                  element.text( value );
                  return;
               }

               if( !isTruncated ) {
                  isTruncated = true;
                  element.text( value );
                  element.trunk8( options );
               }
               else {
                  // trunk8 internally uses the html method. We thus need to encode html entities ourselves
                  var htmlEncoded = $( '<div>' ).text( value ).html();
                  element.trunk8( 'update', htmlEncoded );
               }

            } );
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var axBindHtmlTruncatedDirectiveName = 'axBindHtmlTruncated';
   var axBindHtmlTruncatedDirective = [ '$sanitize', function( $sanitize ) {
      return {
         restrict: 'A',
         link: function( scope, element, attr ) {

            var isTruncated = false;
            var options = getTruncationOptions( scope, attr );

            scope.$watch( attr[ axBindHtmlTruncatedDirectiveName ], function( value ) {
               var sanitizedValue = $sanitize( value );
               if( sanitizedValue == null || sanitizedValue === '' ) {
                  // The check for '' is necessary due to a bug in trunk8.update
                  element.html( '' );
                  return;
               }

               if( !isNaN( options.width ) && sanitizedValue.length <= options.width ) {
                  // This explicit check prevents from triggering a bug in trunk8 plugin
                  element.html( sanitizedValue );
                  return;
               }

               if( !isTruncated ) {
                  isTruncated = true;
                  element.html( sanitizedValue );
                  element.trunk8( options );
               }
               else {
                  element.trunk8( 'update', sanitizedValue );
               }

            } );
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function getTruncationOptions( scope, attr ) {
      return scope.$eval( attr[ truncationOptionsAttribute ] ) || {};
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.directive( axBindTruncatedDirectiveName, axBindTruncatedDirective );
         module.directive( axBindHtmlTruncatedDirectiveName, axBindHtmlTruncatedDirective );
         module.directive( axTextEllipsisDirectiveName, axTextEllipsisDirective );
      }
   };

} );
