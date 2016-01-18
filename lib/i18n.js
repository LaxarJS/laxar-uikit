/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/**
 * Some utilities for working with i18n and finding the correct formats based on the configured language.
 *
 * @module i18n
 */
import * as ax from 'laxar';
import { momentFormats } from './moment_formats';
import { numberFormats } from './number_formats';

const DEFAULT_LANGUAGE_TAG = 'en';

/**
 * Tries to find the language tag that is set for the current AngularJS scope. If no language tag could be
 * determined, `'en'` is returned.
 *
 * @param {Object} scope
 *    the scope to search for the `i18n` property
 *
 * @returns {String}
 *    the language tag
 */
function languageTagFromScope( scope ) {
   return ax.i18n.languageTagFromI18n( scope.$eval( 'i18n' ) ) || DEFAULT_LANGUAGE_TAG;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns formats for usage with Moment.js for the given `languageTag`. The returned value is an object
 * having the properties `date` and `time`, each with an according format string. If a language tag does
 * not exist, `undefined` is returned instead.
 *
 * Example:
 * ```js
 * i18n.momentFormatForLanguageTag( 'de' ); // => { date: 'DD.MM.YYYY', time: 'HH:mm' }
 * i18n.momentFormatForLanguageTag( 'en-gb' ); // => { date: 'DD/MM/YYYY', time: 'HH:mm' }
 * i18n.momentFormatForLanguageTag( 'xy' ); // => undefined
 * ```
 *
 * @param {String} languageTag
 *    the language tag to return the moment format for
 *
 * @return {Object}
 *    the moment format as defined above. `undefined` if not found
 */
function momentFormatForLanguageTag( languageTag ) {
   return findMatchingFormat( momentFormats, languageTag );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns number formatting characters for the given `languageTag`. The returned value is an object having
 * the properties `g` (grouping separator) and `d` (decimal separator), each with the according character
 * to use for that language tag. If a language tag does not exist, `undefined` is returned instead.
 *
 * Example:
 * ```js
 * i18n.momentFormatForLanguageTag( 'de' ); // => { g: '.', d: ',' }
 * i18n.momentFormatForLanguageTag( 'en-gb' ); // => { g: ',', d: '.' }
 * i18n.momentFormatForLanguageTag( 'xy' ); // => undefined
 * ```
 *
 * @param {String} languageTag
 *    the language tag to return the moment format for
 *
 * @return {Object}
 *    the number formatting characters as defined above. `undefined` if not found
 */
function numberFormatForLanguageTag( languageTag ) {
   return findMatchingFormat( numberFormats, languageTag );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @private
 */
function findMatchingFormat( map, languageTag ) {
   return ax.i18n.localizeRelaxed( languageTag, map, map[ DEFAULT_LANGUAGE_TAG ] );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
   languageTagFromScope,
   momentFormatForLanguageTag,
   numberFormatForLanguageTag
};
