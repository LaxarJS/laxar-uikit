/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'jquery'
], function( $ ) {
   'use strict';

   var DISTANCE_TO_WINDOW = 20;
   var POSITION_CLASSES = [ 'center', 'top', 'right', 'bottom', 'left' ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function calculateDomData( layer, $layer ) {
      applyPositionClass( $layer, null );

      var $window = $( window );
      var $anchor = $( layer.configuration_.anchorElementSelector );
      var $contentWrapper =  $layer.children( '[ng-transclude]' );

      var data = {
         contentWrapperSize: {
            height: $contentWrapper.outerHeight(),
            width: $contentWrapper.outerWidth()
         },
         anchorOffset: $anchor.offset(),
         anchorSize: {
            height: $anchor.outerHeight(),
            width: $anchor.outerWidth()
         },
         windowSize: {
            height: $window.height(),
            width: $window.width()
         },
         windowScrolling: {
            top: $window.scrollTop(),
            left: $window.scrollLeft()
         }
      };
      data.layerSize = calculateLayerSize( layer, $layer, data );
      return data;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function calculateLayerSize( layer, $layer, data ) {
      var outerWidth = $layer.outerWidth();
      var outerHeight = $layer.outerHeight();
      var contentWidth = $layer.width();
      var contentHeight = $layer.height();

      var res = {
         isBorderBox: $layer.css( 'box-sizing' ) === 'border-box',

         // size of border and padding of top and bottom or left and right respectively
         framingWidth: outerWidth - contentWidth,
         framingHeight: outerHeight - contentHeight,

         // actually the outer size (content + padding + border)
         outerWidth: outerWidth,
         outerHeight: outerHeight
      };

      // the outer size + the size of an optional arrow
      res.widthWithArrow = data.contentWrapperSize.width + res.framingWidth + layer.configuration_.arrowWidth;
      res.heightWithArrow = data.contentWrapperSize.height + res.framingHeight + layer.configuration_.arrowHeight;
      return res;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function applyPositionClass( $layer, cssClass ) {
      POSITION_CLASSES.forEach( function( positionClass ) {
         $layer.toggleClass( positionClass, positionClass === cssClass );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {

      DISTANCE_TO_WINDOW: DISTANCE_TO_WINDOW,

      calculateDomData: calculateDomData,

      applyPositionClass: applyPositionClass

   };

} );