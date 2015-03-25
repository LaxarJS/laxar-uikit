/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'angular-sanitize'
], function() {
   'use strict';

   var axHtmlAttributeName = 'axHtmlAttribute';
   var axI18nHtmlAttributeName = 'axI18nHtmlAttribute';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var axHtmlAttributeFactory = [ '$sanitize', 'axI18n', function( $sanitize, i18n ) {

      /**
       * Allows to put HTML content into arbitrary attributes.
       *
       * Attribute content may not contain HTML tags, but may contain entity references such as `&quot;`
       * or `&nbsp;`.
       */
      return {
         restrict: 'A',
         link: function( scope, element, attrs ) {

            var postProcess = {};
            postProcess[ axHtmlAttributeName ] = $sanitize;
            postProcess[ axI18nHtmlAttributeName ] = function( i18nHtml ) {
               var locale = scope.i18n.tags[ scope.i18n.locale ];
               if( !locale ) {
                  return typeof( i18nHtml ) === 'string' ? i18nHtml : '';
               }
               return $sanitize( i18n.localize( locale, i18nHtml ) );
            };

            function collectionListener( directiveAttributeName ) {
               var process = postProcess[ directiveAttributeName ];
               return function updateAttributes( newValue, oldValue ) {
                  Object.keys( newValue ).forEach( function( attributeName ) {
                     if( newValue[ attributeName ] !== oldValue[ attributeName ] ) {
                        element.attr( attributeName, process( newValue[ attributeName ] ) );
                     }
                  } );
                  Object.keys( oldValue ).forEach( function( attributeName ) {
                     if( !( attributeName in newValue) ) {
                        element.removeAttr( attributeName );
                     }
                  } );
               };
            }

            if( attrs[ axHtmlAttributeName ] ) {
               var updateHtmlAttributes = collectionListener( axHtmlAttributeName );
               scope.$watchCollection( attrs[ axHtmlAttributeName ], updateHtmlAttributes, true );
               updateHtmlAttributes( scope.$eval( attrs[ axHtmlAttributeName ] ), {} );
            }

            if( attrs[ axI18nHtmlAttributeName ] ) {
               var updateI18nHtmlAttributes = collectionListener( axI18nHtmlAttributeName );
               scope.$watchCollection( attrs[ axI18nHtmlAttributeName ], updateI18nHtmlAttributes, true );
               updateI18nHtmlAttributes( scope.$eval( attrs[ axI18nHtmlAttributeName ] ), {} );

               scope.$watch( 'i18n', function() {
                  updateI18nHtmlAttributes( scope.$eval( attrs[ axI18nHtmlAttributeName ] ), {} );
               }, true );
            }
         }
      };

   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.directive( axHtmlAttributeName, axHtmlAttributeFactory );
         module.directive( axI18nHtmlAttributeName, axHtmlAttributeFactory );
      }
   };

} );
