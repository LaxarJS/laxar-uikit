/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar'
], function( ng, ax, undefined ) {
   'use strict';

   /*
   $scope.i18n = {
      // 'locale' can be overridden in sub-scopes by using axBindLocale
      locale: 'default',
      tags: {
         'default': 'en_US',
         'customer': 'de_DE',
         'support': 'en_GB'
      }
   };
   */

   var i18n_ = ax.i18n;
   var slice = [].slice;

   var axBindLocaleName = 'axBindLocale';
   var axLocalizeName = 'axLocalize';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var axBindLocaleFactory = [ function() {

      /**
       * Configure the locale for this element and for all nested elements (using a new nested scope).
       *
       * Widget controllers should ensure that not using this directive is equivalent to surrounding the
       * entire widget-template with ax-bind-locale="features.i18n.locale" by setting i18n.locale themselves.
       */
      return {
         restrict: 'A',
         scope: true,
         priority: 5000,
         link: {
            pre: function( scope, element, attrs ) {
               if( !scope.hasOwnProperty( 'i18n' ) ) {
                  // inherit widget-wide i18n.tags from parent scope!
                  scope.i18n = { tags: scope.i18n ? scope.i18n.tags : {} };
               }
               var binding = attrs[ axBindLocaleName ];
               scope.$watch( binding, function( newValue ) {
                  scope.i18n.locale = newValue;
               } );
            }
         }
      };

   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var axLocalizeFactory = [ function() {
      /**
       * Localize the given value, based on the given i18n state.
       *
       * @param {*} i18nValue  A value to localize.
       * @param {{locale: String, tags: Map<String, String>}} i18n
       *   The information based on which to localize, usually $scope.i18n.
       */
      return function axLocalize( i18nValue, i18n /* args... */ ) {
         if( !i18n || !i18n.locale || !i18n.tags ) {
            return undefined;
         }
         var languageTag = i18n.tags[ i18n.locale ];
         if( !languageTag ) {
            return undefined;
         }
         if( arguments.length > 2 ) {
            var localizer = i18n_.localizer( languageTag );
            var args = [ i18nValue ].concat( slice.call( arguments, 2 ) );
            return localizer.format.apply( localizer, args );
         }
         return i18n_.localize( languageTag, i18nValue );
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module
            .directive( axBindLocaleName, axBindLocaleFactory )
            .filter( axLocalizeName, axLocalizeFactory );
      }
   };

} );