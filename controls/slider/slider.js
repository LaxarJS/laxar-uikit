/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'jquery',
   'jquery_ui/slider'
], function( ng, $ ) {
   'use strict';

   var directiveName = 'axSlider';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directive = [ '$rootScope', function( $rootScope ) {
      return {
         restrict: 'A',
         require: [ 'ngModel' ],
         link: function( scope, element, attrs, controllers ) {
            var ngModel = controllers[ 0 ];

            ngModel.$render = function() {
               // The jQuery UI slider will fail to initialize if the initial value is null or undefined.
               // http://stackoverflow.com/questions/11728079/jquery-ui-slider-cannot-call-method-addclass-of-undefined
               element.slider( 'value', ngModel.$modelValue || 0 );
            };

            var defaultOptions = {
               min: 0,
               max: 100,
               value: 0,
               step: 1,
               range: 'min'
            };

            scope.$watch( attrs[ directiveName ], applyOptions, true );

            applyOptions( scope.$eval( attrs[ directiveName ] ) );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function applyOptions( options ) {
               element.slider( $.extend( {}, defaultOptions, options, {
                  slide: function changeHandler( event, ui ) {
                     ngModel.$setViewValue( ui.value );
                     if( !$rootScope.$$phase ) {
                        $rootScope.$digest();
                     }
                  }
               } ) );

               if( element.slider( 'value' ) !== ngModel.$modelValue ) {
                  // This might happen, if the options are modified shortly after a value update
                  ngModel.$render();
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
