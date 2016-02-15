/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/**
 * Utilities for dealing with the browser DOM.
 *
 * @module dom
 */
const cssTransformPropertyName = createPrefixTest(
   'transform',
   function( div, prefixedProperty ) {
      div.style[ prefixedProperty ] = 'rotate(45deg)';
   },
   function( div, prefixedProperty ) {
      div.style[ prefixedProperty ] = '';
   },
   function( div ) {
      var rect = div.getBoundingClientRect();
      return rect.right - rect.left !== 100;
   }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @private
 */
function createPrefixTest( property, setup, tearDown, test ) {
   var knownPrefixes = [ '', 'Moz', 'Webkit', 'O' ];

   return function tester() {
      if( typeof tester._result === 'undefined' ) {

         tester._result = null;
         var div = document.createElement( 'DIV' );
         div.style.visibility = 'hidden';
         div.style.position = 'absolute';
         div.style.height = '100px';
         div.style.width = '100px';
         document.body.appendChild( div );

         var prefixed = '';
         for( var i = 0; i < knownPrefixes.length; ++i ) {
            prefixed = knownPrefixes[ i ];
            prefixed += prefixed.length > 0 ? capitalize( property ) : property;

            setup( div, prefixed );

            if( test( div, prefixed ) === true ) {
               tester._result = prefixed;
               break;
            }

            tearDown( div, prefixed );
         }

         document.body.removeChild( div );
      }

      return tester._result;
   };
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @private
 */
function capitalize( inputString ) {
   if( typeof inputString !== 'string' || inputString.length < 1 ) {
      return inputString;
   }

   return inputString.charAt( 0 ).toUpperCase() + inputString.slice( 1 );
}

export {
   cssTransformPropertyName
};
