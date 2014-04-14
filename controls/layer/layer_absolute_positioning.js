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

   function calculateOffsetForTop( layer, $layer, domData ) {
      layerUtils.applyPositionClass( $layer, 'top' );

      var innerHeight = domData.contentWrapperSize.height;
      var outerHeight = domData.contentWrapperSize.height + domData.layerSize.framingHeight;
      var appliedOuterHeight = domData.layerSize.isBorderBox ? innerHeight : outerHeight;

      return {
         offsets: {
            top: layerUtils.DISTANCE_TO_WINDOW,
            left: domData.windowSize.width * 0.5 - domData.layerSize.outerWidth * 0.5,
            height: appliedOuterHeight
         },
         styles: {},
         arrowOffsets: null
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {

      create: function( layer, $layer ) {
         return {
            calculate: function( domData ) {
               return calculateOffsetForTop( layer, $layer, domData );
            }
         };
      }

   };

} );