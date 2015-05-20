/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar',
   'jquery_ui/accordion'
], function( ng, ax ) {
   'use strict';

   var directiveName = 'axAccordion';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directive = [
      '$compile', '$parse', '$window',
      function( $compile, $parse, $window ) {
      return {
         restrict: 'A',
         link: function( scope, element, attrs ) {

            var parsedOnBeforeActivate = function() { return true; };
            if( attrs.axAccordionOnBeforeActivate ) {
               parsedOnBeforeActivate = $parse( attrs.axAccordionOnBeforeActivate );
            }

            // stay hidden until the jQuery accordion control has been instantiated
            element.addClass( 'ax-invisible' );
            var uiIndex = -1;

            var getSelectedPanel = $parse( attrs.axAccordionSelectedPanel );
            var setSelectedPanel = getSelectedPanel.assign || function() {};

            var refresh = ax.fn.debounce( function() { element.accordion( refresh ); }, 100 );
            var options = ax.object.options( scope.$eval( attrs[ directiveName ] ), {
               duration: 400,
               active: getSelectedPanel( scope ) || 0
            } );

            var animate = options.animate || options.duration;
            options.animate = false;
            options.beforeActivate = beforeActivate;

            // one-off $watch to make sure contents (e.g. other widgets) are attached to the dom and linked
            var doneInitializing = scope.$watch( function() {
               doneInitializing();

               element.accordion( options );
               element.removeClass( 'ax-invisible' );

               $window.setTimeout( function() {
                  // re-enable animations after initial selection has taken place
                  element.accordion( 'option', 'animate', animate );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               scope.$watch( attrs.axAccordionSelectedPanel, function( newIndex ) {
                  if( newIndex !== uiIndex ) {
                     element.accordion( 'option', 'active', newIndex );
                  }
               } );

               scope.$on( 'axAccordion.refresh', refresh );

               scope.$on( 'axAccordion.options', function( event, options ) {
                  ng.forEach( options, function( value, key ) {
                     element.accordion( 'option', key, value );
                  } );
               } );

            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function beforeActivate( event, ui ) {
               var index = element.find( element.accordion( 'option', 'header' ) ).index( ui.newHeader );
               if( uiIndex === index ) {
                  return;
               }

               var result = parsedOnBeforeActivate( scope, { index: index, scope: scope } );
               if( result === false ) {
                  event.preventDefault();
               }
               else {
                  uiIndex = index;
                  setSelectedPanel( scope, index );
                  // Guarded apply: `beforeActivate` may be triggered indirectly by $digest, or by a primitive
                  // DOM event-handler (set by jQuery UI) that is not hooked into AngularJS.
                  if( !scope.$$phase ) {
                     scope.$apply();
                  }
               }
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
