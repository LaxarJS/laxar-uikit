/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'laxar',
   './moment_date_formats',
   './number_formats'
], function( ax, i18nMomentDateFormats, i18nNumberFormats ) {
   'use strict';

   var DEFAULT_LANGUAGE_TAG = 'en';

   function languageTagFromScope( scope ) {
      return ax.i18n.languageTagFromI18n( scope.$eval( 'i18n' ) ) || DEFAULT_LANGUAGE_TAG;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function momentFormatForLanguageTag( languageTag ) {
      return findMatchingFormat( i18nMomentDateFormats, languageTag );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function numberFormatForLanguageTag( languageTag ) {
      return findMatchingFormat( i18nNumberFormats, languageTag );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function findMatchingFormat( map, languageTag ) {
      return ax.i18n.localizeRelaxed( languageTag, map, map[ DEFAULT_LANGUAGE_TAG ] );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {

      languageTagFromScope: languageTagFromScope,

      momentFormatForLanguageTag: momentFormatForLanguageTag,

      numberFormatForLanguageTag: numberFormatForLanguageTag

   };

} );