/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [ 'laxar' ], function( ax ) {
   'use strict';

   function getComputedStyle( node, property ){
      if( node.currentStyle ) {
         return node.currentStyle[ property ];
      }
      else if( document.defaultView && document.defaultView.getComputedStyle ) {
         return document.defaultView.getComputedStyle( node, '' )[ property ];
      }
      else {
         return node.style[ property ];
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
    * @deprecated This functionality will be removed in an upcoming major release, because it is
    *    detrimental to performance. Use the axVisibilityService instead.
    */
   function ensureRenderingAndApplyFunction( node, func ) {
      ax.log.warn( 'DEPRECATION: ensureRenderingAndApplyFunction: use the axVisibilityService instead' );

      var currentNode = node;
      var nodesToRestore = [];

      do {
         var style = currentNode.style;
         if( getComputedStyle( currentNode, 'display' ) === 'none' ) {
            var restoreInfo = {
               node: currentNode,
               visibility: style.visibility,
               position: style.position,
               display: style.display
            };

            // ng-hide uses display:none !important
            var styleAttribute = '';
            if( currentNode.hasAttribute( 'style' ) ) {
               styleAttribute = currentNode.getAttribute( 'style' );
               restoreInfo.styleAttribute = styleAttribute;
            }

            // This order must be used:
            currentNode.setAttribute( 'style', styleAttribute + '; display: block !important;' );
            style.position = 'absolute';
            style.visibility = 'hidden';

            nodesToRestore.push( restoreInfo );
         }
         currentNode = currentNode.parentNode;
      }
      while( currentNode !== document.body );

      var result;
      var possibleException;
      try {
         result = func();
      }
      catch( e ) {
         possibleException = e;
      }

      nodesToRestore.forEach( function( restoreInfo ) {
         var style = restoreInfo.node.style;
         style.display = restoreInfo.display;
         style.position = restoreInfo.position;
         style.visibility = restoreInfo.visibility;
         if( restoreInfo.styleAttribute ) {
            restoreInfo.node.setAttribute( 'style', restoreInfo.styleAttribute );
         }
         else {
            restoreInfo.node.removeAttribute( 'style' );
         }
      } );

      if( possibleException ) {
         throw possibleException;
      }
      return result;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var cssTransformPropertyName = createPrefixTest(
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

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {

      getComputedStyle: getComputedStyle,

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      /**
       * @deprecated This functionality will be removed in an upcoming major release, because it is
       *    detrimental to performance. Use the axVisibilityService instead.
       */
      ensureRenderingAndApplyFunction: ensureRenderingAndApplyFunction,

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      cssTransformPropertyName: cssTransformPropertyName

   };

} );