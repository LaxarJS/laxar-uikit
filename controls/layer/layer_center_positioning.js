/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'jquery',
   './layer_utils'
], function( $, layerUtils ) {
   'use strict';

   function calculateOffsetForCenter( layer, $layer, domData ) {
      layerUtils.applyPositionClass( $layer, 'center' );

      var innerHeight = domData.contentWrapperSize.height;
      var outerHeight = domData.contentWrapperSize.height + domData.layerSize.framingHeight;
      var availableHeight = domData.windowSize.height - 2 * layerUtils.DISTANCE_TO_WINDOW;

      var overflowY = 'hidden';
      var height;
      // jira ATP-7114: Finish all ongoing animations to prevent from wrong height calculations
      if( outerHeight <= availableHeight ) {
         height = domData.layerSize.isBorderBox ? outerHeight : innerHeight;
      }
      else if( outerHeight > availableHeight ) {
         height = availableHeight;
         if( !domData.layerSize.isBorderBox ) {
            height -= domData.layerSize.framingHeight;
         }
         overflowY = 'scroll';
      }

      domData = layerUtils.calculateDomData( layer, $layer );

      var appliedOuterHeight = height + ( domData.layerSize.isBorderBox ? 0 : domData.layerSize.framingHeight );

      return {
         offsets: {
            top: domData.windowSize.height * 0.5 - appliedOuterHeight * 0.5,
            left: domData.windowSize.width * 0.5 - domData.layerSize.outerWidth * 0.5,
            height: height
         },
         styles: {
            overflowY: overflowY
         },
         arrowOffsets: null
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {

      create: function( layer, $layer ) {
         return {
            calculate: function( domData ) {
               return calculateOffsetForCenter( layer, $layer, domData );
            }
         };
      }

   };

} );