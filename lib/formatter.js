/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/**
 * A module for formatting values of different types to strings.
 *
 * @module formatter
 */
import { object } from 'laxar';
import moment from 'moment';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const ISO_TIME_FORMAT = 'HH:mm:ss';
const ISO_FULL_FORMAT_MIN_LENGTH = `${ISO_DATE_FORMAT}T${ISO_TIME_FORMAT}`.length;
const NUMERICAL_STRING_REGEXP = /^([+-])?\d+(\.\d+)?$/;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const formatters = {

   string: ( options, str ) => str == null ? '' : `${str}`,

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   decimal( options, value ) {
      if( value == null ) { return ''; }

      const number = ( typeof value === 'string' && NUMERICAL_STRING_REGEXP.exec( value ) ) ?
         parseFloat( value ) :
         value;

      if( typeof number !== 'number' ) {
         throw new TypeError(
            `Expected argument of type number, but got "${typeof value}". Value: ${value}`
         );
      }

      const numberParts = toPrecision(
         number,
         options.decimalPlaces,
         options.decimalTruncation
      ).split( '.' );
      const integerPart = numberParts[ 0 ].replace( /^[+-]/, '' );
      const fractionPart = numberParts[ 1 ] || '';

      const integerLength = integerPart.length - 1;
      const front = integerPart.split( '' ).reduce( ( str, digit, index ) => {
         const pos = integerLength - index;
         return str + digit + ( pos % 3 === 0 && pos !== 0 ? options.groupingSeparator : '' );
      }, number < 0 ? '-' : '' );

      return front + ( fractionPart.length > 0 ? options.decimalSeparator + fractionPart : '' );
   },

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   integer( options, number ) {
      const integerOptions = object.options( { decimalPlaces: 0 }, options );
      return formatters.decimal( integerOptions, number );
   },

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   date: createDateTimeFormatter( 'date', ISO_DATE_FORMAT ),

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   time: createDateTimeFormatter( 'time', ISO_TIME_FORMAT )
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createDateTimeFormatter( type, inputFormat ) {
   return ( options, value ) => {
      if( value == null ) {
         return '';
      }

      if( value instanceof Date ) {
         return format( moment( value ) );
      }

      if( typeof value !== 'string' ) {
         throw argumentError( value );
      }

      const useInputFormat = value.length < ISO_FULL_FORMAT_MIN_LENGTH;
      const momentTime = value.toLowerCase() === 'now' ?
         moment() :
         moment( value, useInputFormat ? inputFormat : undefined, useInputFormat || undefined );

      if( !momentTime.isValid() ) {
         throw argumentError( value );
      }

      return format( momentTime );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function format( momentTime ) {
         return momentTime.format( options[ `${type}Format` ] );
      }

      function argumentError( value ) {
         return new TypeError(
            'Expected argument to be a Date object, the string "NOW", or an ISO-8601 string ' +
            `(full, or ${type} as ${inputFormat}), but got "${typeof value}". Value: ${value}`
         );
      }
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function toPrecision( number, places, truncation ) {
   // Define a maximum precision for truncation=NONE, taking into account 32bit machine limits.
   // We cannot use Number.toFixed because of rounding errors in MSIE8.
   const MAX_SIGNIFICANT_PLACES = 14;

   const actualPlaces = truncation === 'NONE' ? MAX_SIGNIFICANT_PLACES : places;

   if( actualPlaces === 0 ) {
      return `${Math.round( number )}`;
   }

   const multiplier = Math.pow( 10, actualPlaces );
   let str = `${Math.round( number * multiplier ) / multiplier}`;

   // Detect and avoid scientific notation for numbers x where |x| << 10^(-5)
   // A heuristic is used to avoid unnecessary string operations for "regular" numbers
   const absNumber = Math.abs( number );
   if( absNumber < 0.0001 ) {
      const exponent = parseInt( str.split( 'e-' )[ 1 ], 10 );
      if( exponent ) {
         const base = `${Math.pow( 10, exponent - 1 ) * Math.round( absNumber * multiplier ) / multiplier}`;
         str = `${number < 0 ? '-' : ''}0.${zeros( exponent - 1 ) + base.substring( 2 )}`;
      }
   }

   if( truncation === 'BOUNDED' || truncation === 'NONE' ) {
      return str;
   }

   const tmp = str.split( '.' );
   if( tmp.length === 1 ) {
      return `${str}.${zeros( actualPlaces )}`;
   }

   return str + zeros( actualPlaces - tmp[ 1 ].length );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function zeros( count ) {
   return new Array( count + 1 ).join( '0' );
}

/**
 * Creates a function to format values of a given type to a configurable string representations. If a
 * value has the wrong type to be formatted using the configured `type`, the format function throws a
 * `TypeError`.
 *
 * When formatting values for display as date or time, the full datetime should always be passed if
 * available; either as a Date-object, or as a full [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) string,
 * including timezone. To format a date without time or to format a time-of-day, the respective ISO-formatted
 * portions can be passed instead, without TZ information.
 * Finally, the string "NOW" can be used which always results in the current local date/time.
 *
 * Acceptable *input* values for
 *    - date: `"NOW", new Date(), "2014-03-22T14:52:03.444Z", "2014-03-22"`
 *    - time: `"NOW", new Date(), "2014-03-22T14:52:03.444Z", "14:52:03"`
 *
 * The formatter for type `'string'` simply triggers the `toString` method of the given argument, while
 * `null` and `undefined` result in the empty string.
 *
 * @param {String} type
 *    the value type to create the formatter for. Can be one of `'string'`, `'integer'`, `'decimal'`,
 *    `'date'` and `'time'`
 * @param {Object} [optionalOptions]
 *    different options depending on the selected `type`
 * @param {String} optionalOptions.groupingSeparator
 *    the character used for thousands separation. Applicable to types `decimal` and `integer` only.
 *    Default: `','`
 * @param {String} optionalOptions.decimalSeparator
 *    the character used for fraction part separation. Applicable to type `decimal` only.
 *    Default: `'.'`
 * @param {Number} optionalOptions.decimalPlaces
 *    number of decimal places to keep in the formatted value. Applies rounding if necessary. Applicable
 *    to type `decimal` only.
 *    Default: `2`
 * @param {String} optionalOptions.decimalTruncation
 *    how to treat insignificant decimal places (trailing zeros):
 *    - `'FIXED'`: uses a fraction length of exactly `decimalPlaces`, padding with zeros
 *    - `'BOUNDED'`: uses a fraction length up to `decimalPlaces`, no padding
 *    - `'NONE'`: unbounded fraction length (only limited by numeric precision), no padding
 *    Applicable to type `decimal` only.
 *    Default: `'FIXED'`
 * @param {String} optionalOptions.dateFormat
 *    the format used to format date values with. Applicable to type `date` only.
 *    Default: `'M/D/YYYY'`
 * @param {String} optionalOptions.timeFormat
 *    the format used to format time values with. Applicable to type `time` only.
 *    Default: `'H:m'`
 *
 * @return {Function}
 *    the format function as described above. Throws a `TypeError` if the provided value cannot be
 *    formatted using the configured `type`
 */
export function create( type, optionalOptions ) {
   const options = object.options( optionalOptions, {
      groupingSeparator: ',',
      decimalSeparator: '.',
      decimalPlaces: 2,
      decimalTruncation: 'FIXED',
      dateFormat: 'M/D/YYYY',
      timeFormat: 'H:m'
   } );
   return formatters[ type ].bind( formatters, options );
}
