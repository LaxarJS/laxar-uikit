/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'underscore',
   'laxar_uikit',
   'jquery_ui/accordion'
], function( angular, _, axUi ) {
   'use strict';

   var directiveName = 'axAccordion';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directive = [ '$compile', '$parse', function( $compile, $parse ) {
      return {
         restrict: 'A',
         link: function( scope, element, attrs ) {
            var parsedOnBeforeActivate = function() { return true; };
            if( attrs.axAccordionOnBeforeActivate ) {
               parsedOnBeforeActivate = $parse( attrs.axAccordionOnBeforeActivate );
            }

            var options = _.defaults( scope.$eval( attrs[ directiveName ] ) || {}, {
               duration: 400
            } );

            var cachedHeightOfHeaders = null;
            options.beforeActivate = function( event, ui ) {
               var index = element.find( element.accordion( 'option', 'header' ) ).index( ui.newHeader );
               var result = parsedOnBeforeActivate( scope, { index: index, scope: scope } );
               if( result === false ) {
                  event.preventDefault();
                  return;
               }

               var newPanelHeight = axUi.dom.ensureRenderingAndApplyFunction( element[0], function() {
                  if( cachedHeightOfHeaders == null ) {
                     cachedHeightOfHeaders = calculatePanelHeadersHeight();
                  }

                  return ui.newPanel.outerHeight( true );
               } );

               // we need to animate resizing of the accordion element manually to prevent from flickering of
               // siblings below the accordion (for example a command bar).
               var newAccordionHeight = cachedHeightOfHeaders + newPanelHeight;
               element.stop( true, true );
               element.animate( {
                  height: newAccordionHeight + 'px'
               }, options.duration, function() {
                  element.height( 'auto' );
               } );
            };

            element.accordion( options );

            scope.$watch( attrs.axAccordionSelectedPanel, function( newIndex ) {
               element.accordion( 'option', 'active', newIndex );
            } );

            scope.$on( 'axAccordion.refresh', function() {
               cachedHeightOfHeaders = null;

               element.accordion( 'refresh' );
               element.accordion( 'option', 'active', scope.$eval( attrs.axAccordionSelectedPanel ) );
            } );

            scope.$on( 'axAccordion.options', function( event, options ) {
               _.each( options, function( value, key ) {
                  element.accordion( 'option', key, value );
               } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function calculatePanelHeadersHeight() {
               var headers = element.find( element.accordion( 'option', 'header' ) );
               return _.reduce( headers, function( height, header ) {
                  var hElem = angular.element( header );
                  var elemHeight = hElem.outerHeight( true );
                  var pElem = hElem.parent();
                  while( !pElem.is( element ) ) {
                     elemHeight += pElem.outerHeight( true ) - pElem.height();
                     pElem = pElem.parent();
                  }

                  return elemHeight + height;
               }, 0 );
            }
         }
      };
   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return {
      createForModule: function( module ) {
         module.directive( directiveName, directive );
      }
   };

} );