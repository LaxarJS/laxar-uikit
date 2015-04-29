/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'moment',
   './constants'
], function( moment, constants ) {
   'use strict';

   function isActiveElement( element ) {
      return element === document.activeElement;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function isInRange( valueType, from, to, value ) {
      return isGreaterOrEqual( valueType, from, value ) && isSmallerOrEqual( valueType, to, value );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function isGreaterOrEqual( valueType, minimum, value ) {
      switch( valueType ) {
         case 'decimal':
         case 'integer':
            return parseFloat( minimum ) <= value;

         case 'date':
         case 'time':
            var mMinimum = toMoment( valueType, minimum );
            var mValue = toMoment( valueType, value );

            return mMinimum.isBefore( mValue ) || mMinimum.isSame( mValue );

         default:
            throw new Error( 'Unsupported type for comparisons: ' + valueType );
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function isSmallerOrEqual( valueType, maximum, value ) {
      switch( valueType ) {
         case 'decimal':
         case 'integer':
            return parseFloat( maximum ) >= value;

         case 'date':
         case 'time':
            var mMaximum = toMoment( valueType, maximum );
            var mValue = toMoment( valueType, value );

            return mMaximum.isAfter( mValue ) || mMaximum.isSame( mValue );

         default:
            throw new Error( 'Unsupported type for comparisons: ' + valueType );
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function substitute( str, substitutions ) {
      return Object.keys( substitutions ).reduce( function( str, key ) {
         return str.split( '[' + key + ']' ).join( substitutions[ key ] );
      }, str );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /** @private */
   function toMoment( valueType, value ) {
      if( !value || value.toLowerCase() === 'now' ) {
         // just returning `moment()` isn't sufficient, as for dates the time is expected to be 00:00:00.
         // We thus take this rather pragmatic approach.
         value = moment().format( valueType === 'time' ? constants.ISO_TIME_FORMAT : constants.ISO_DATE_FORMAT );
      }
      return moment( value, valueType === 'time' ? constants.ISO_TIME_FORMAT : constants.ISO_DATE_FORMAT );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      isActiveElement: isActiveElement,
      isInRange: isInRange,
      isGreaterOrEqual: isGreaterOrEqual,
      isSmallerOrEqual: isSmallerOrEqual,
      substitute: substitute
   };

} );
