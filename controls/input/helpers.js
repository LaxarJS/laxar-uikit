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

   function getSelectionRange( element ) {
      if( typeof element.selectionStart === 'number' && typeof element.selectionEnd === 'number' ) {
         return {
            start: element.selectionStart,
            end: element.selectionEnd
         };
      }
      else {
         // ugly IE 8 code
         var range = document.selection.createRange();
         if( !range || range.parentElement() !== element ) {
            // early return if there is no selection at all for the requested element
            return { start: 0, end: 0 };
         }

         var elementValue = element.value;
         var valueLength = elementValue.length;
         var textRange = element.createTextRange();
         var endRange = element.createTextRange();

         textRange.moveToBookmark( range.getBookmark() );
         endRange.collapse( false );

         if( textRange.compareEndPoints( 'StartToEnd', endRange ) > -1 ) {
            return { start: valueLength, end: valueLength };
         }

         elementValue = elementValue.replace( /\r\n/g, '\n' );
         var selectionStart = -textRange.moveStart( 'character', -valueLength );
         selectionStart += elementValue.slice( 0, selectionStart ).split( '\n' ).length - 1;

         var selectionEnd = valueLength;
         if( textRange.compareEndPoints( 'EndToEnd', endRange ) <= -1 ) {
            selectionEnd = -textRange.moveEnd( 'character', -valueLength );
            selectionEnd += elementValue.slice( 0, selectionEnd ).split( '\n' ).length - 1;
         }

         return {
            start: selectionStart,
            end: selectionEnd
         };
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function setSelectionRange( element, selectionStart, selectionEnd ) {
      if( element.setSelectionRange ) {
         element.setSelectionRange( selectionStart, selectionEnd );
      }
      else if( element.createTextRange ) {
         // IE <= 8
         var range = element.createTextRange();
         range.collapse( true );
         range.moveEnd( 'character', selectionEnd );
         range.moveStart( 'character', selectionStart );
         range.select();
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

            return mMinimum.isBefore( mValue ) || mMinimum.isSame( value );

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

            return mMaximum.isAfter( mValue ) || mMaximum.isSame( value );

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
      getSelectionRange: getSelectionRange,
      setSelectionRange: setSelectionRange,
      isActiveElement: isActiveElement,
      isInRange: isInRange,
      isGreaterOrEqual: isGreaterOrEqual,
      isSmallerOrEqual: isSmallerOrEqual,
      substitute: substitute
   };
   
} );