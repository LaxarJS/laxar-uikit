/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/**
 * A module for parsing strings to different value types.
 *
 * @module parser
 */
import { object } from 'laxar';
import moment from 'moment';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const ISO_TIME_FORMAT = 'HH:mm:ss';
const NUMERIC_VALUE_MATCHER = /^[+\-]?[0-9]*(\.[0-9]*)?$/;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const parsers = {

   string: ( options, str ) => success( str ),

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   decimal( options, str ) {
      let val = `${str}`.trim();

      if( val.length === 0 ) {
         return success( null );
      }

      if( options.groupingSeparator ) {
         while( val.indexOf( options.groupingSeparator ) !== -1 ) {
            val = val.replace( options.groupingSeparator, '' );
         }
      }
      val = val.replace( options.decimalSeparator, '.' );

      if( NUMERIC_VALUE_MATCHER.exec( val ) ) {
         const parsed = parseFloat( val );
         if( !isNaN( parsed ) ) {
            return success( parsed );
         }
      }
      return error();
   },

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   integer( options, str ) {
      const result = parsers.decimal( options, str );
      if( !result.ok || result.value === null ) {
         return result;
      }

      const integerValue = Math.round( result.value );
      if( result.value !== integerValue ) {
         return error();
      }

      return success( integerValue );
   },

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   date: createDateTimeParser( 'dateFormat', 'dateFallbackFormats', ISO_DATE_FORMAT ),

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   time: createDateTimeParser( 'timeFormat', 'timeFallbackFormats', ISO_TIME_FORMAT )

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createDateTimeParser( formatKey, fallbackFormatsKey, isoFormat ) {
   return ( options, str ) => {
      const val = `${str}`.trim();

      if( val.length === 0 ) {
         return success( null );
      }

      let formats = [ options[ formatKey ] ];
      if( options[ fallbackFormatsKey ] && options[ fallbackFormatsKey ].length ) {
         formats = options[ fallbackFormatsKey ].concat( formats );
      }

      const mDate = momentParse( str, formats, options );
      return mDate.isValid() ? success( mDate.format( isoFormat ) ) : error();
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function momentParse( str, formats, options ) {
   const origParseTwoDigitYear = moment.parseTwoDigitYear;
   if( options.dateTwoDigitYearWrap > -1 && options.dateTwoDigitYearWrap < 100 ) {
      moment.parseTwoDigitYear = input => {
         let int = parseInt( input, 10 );
         int = isNaN( int ) ? 0 : int;
         return int + ( int > options.dateTwoDigitYearWrap ? 1900 : 2000 );
      };
   }

   try {
      return moment( str, formats, true );
   }
   finally {
      moment.parseTwoDigitYear = origParseTwoDigitYear;
   }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a successful parsing result. This is useful e.g. when writing tests.
 *
 * @param {*} value
 *    the parsing result
 *
 * @return {Object}
 *    the parsing result object of form `{ ok: true, value: value }`
 */
export function success( value ) {
   return {
      ok: true,
      value
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a failed parsing result. This is useful e.g. when writing tests.
 *
 * @return {Object}
 *    the parsing result object of form `{ ok: false }`
 */
export function error() {
   return {
      ok: false
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a function for parsing strings to a value of the given type. The function only accepts the
 * string to parse as argument and returns an object yielding success or failure. The outcome can be
 * read from the object's attribute `ok` which is `true` in case parsing was successful, or `false`
 * otherwise. Additionally, when the string was parsed successfully as the a value of the given type,
 * the parsed value can be found under the attribute `value`.
 *
 * Note that results for types `date` and `time` are not returned as JavaScript type `Date` or wrapped
 * otherwise, but as simple [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) strings. Thus a possible
 * date would be `'2014-03-12'` and a time value `'16:34:52'`.
 *
 * The parser for type `'string'` will always return a successful result with the given input as the
 * result's value.
 *
 * Example:
 * --------
 * Successful parsing:
 * ```js
 * const parse = parser.create( 'decimal' );
 * parse( '1,435.56' ); // -> { ok: true, value: 1435.56 }
 * ```
 * Failed parsing:
 * ```js
 * const parse = parser.create( 'date' );
 * parse( 'laxar' ); // -> { ok: false }
 * ```
 *
 * @param {String} type
 *    the value type to create the parser for. Can be one of `'string'`, `'integer'`, `'decimal'`,
 *    `'date'` and `'time'`
 * @param {Object} [optionalOptions]
 *    different options depending on the selected `type`
 * @param {String} optionalOptions.groupingSeparator
 *    the character used for thousands separation. Applicable to types `decimal` and `integer` only.
 *    Default: `','`
 * @param {String} optionalOptions.decimalSeparator
 *    the character used for fraction part separation. Applicable to type `decimal` only.
 *    Default: `'.'`
 * @param {String} optionalOptions.dateFormat
 *    the expected format for dates to parse. If the input doesn't match this format, the
 *    `optionalOptions.dateFallbackFormats` are tried. Applicable to type `date` only.
 *    Default: `'M/D/YYYY'`
 * @param {String} optionalOptions.dateFallbackFormats
 *    formats to try, when parsing with the `optionalOptions.dateFormat` failed. Applicable to type
 *    `date` only.
 *    Default: `[ 'M/D/YY' ]`
 * @param {Number} optionalOptions.dateTwoDigitYearWrap
 *    the value to decide when parsing a two digit year, if the resulting year starts with `19` or with
 *    `20`. Any value below or equal to this number results in a year of the form 20xx, whereas any
 *    value above results in a year of the form 19xx. Applicable to type `date` only.
 *    Default: `68`
 * @param {String} optionalOptions.timeFormat
 *    the expected format for times to parse. If the input doesn't match this format, the
 *    `optionalOptions.timeFallbackFormats` are tried. Applicable to type `time` only.
 *    Default: `'H:m'`
 * @param {String} optionalOptions.timeFallbackFormats
 *    formats to try, when parsing with the `optionalOptions.timeFormat` failed. Applicable to type
 *    `time` only.
 *    Default: `[ 'H', 'HHmm' ]`
 *
 * @return {Function}
 *    the parsing function as described above
 */
export function create( type, optionalOptions ) {
   const options = object.options( optionalOptions, {
      groupingSeparator: ',',
      decimalSeparator: '.',
      dateFormat: 'M/D/YYYY',
      dateFallbackFormats: [ 'M/D/YY' ],
      dateTwoDigitYearWrap: 68,
      timeFormat: 'H:m',
      timeFallbackFormats: [ 'H', 'HHmm' ]
   } );
   return parsers[ type ].bind( {}, options );
}
