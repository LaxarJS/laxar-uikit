/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/*global jQuery,runs,waitsFor*/
define( [
   'laxar_uikit/controls/layer',
   'laxar_uikit/controls/layer/layer_utils',
   'laxar/laxar_testing',
   'angular-mocks',
   'text!./html/simple_layer.html'
], function( layerModule, layerUtils, ax, angularMocks, simpleLayerHtml ) {
   'use strict';

   var $ = ax.testing.jQueryMock;
   var $rootScope;
   var $compile;

   beforeEach( angularMocks.module( 'laxar_uikit.controls.layer' ) );
   beforeEach( angularMocks.inject( function( _$compile_, _$rootScope_ ) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $rootScope.layerShowing = false;

      jasmine.Clock.useMock();

      $.mockMethod( 'fadeIn', '#myLayer', function( speed, func ) {
         document.getElementById( 'myLayer' ).style.display = 'block';
         func();
      } );
      $.mockMethod( 'fadeOut', '#myLayer', function( speed, func ) {
         document.getElementById( 'myLayer' ).style.display = 'none';
         func();
      } );
   } ) );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   afterEach( function() {
      try {
         scope().layer.hide();
      }
      catch( e ) {}

      removeAllDomFragments();
      $.mockReset();
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A Layer', function() {

      it( 'should throw an error if no layer element selector was set', function() {
         createLayerWithConfiguration( {
            anchorElementSelector: '#myAnchor'
         } );

         expect( showLayerViaDirectiveBinding )
            .toThrow( 'Assertion error: Expected value to be defined and not null.' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'should throw an error if the layer element does not exist', function() {
         createLayerWithConfiguration( {
            layerElementSelector: '#myImaginaryLayer',
            anchorElementSelector: '#myAnchor'
         } );

         expect( showLayerViaDirectiveBinding )
            .toThrow( 'Assertion error: State does not hold. Details: No element with selector "#myImaginaryLayer" found.' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'must not throw an error if no anchor element id was set', function() {
         createLayerWithConfiguration( {
            layerElementSelector: '#myLayer'
         } );
         expect( showLayerViaDirectiveBinding ).not.toThrow();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'should throw an error if the anchor element does not exist', function() {
         createLayerWithConfiguration( {
            layerElementSelector: '#myLayer',
            anchorElementSelector: '#myImaginaryAnchor'
         } );
         expect( showLayerViaDirectiveBinding )
            .toThrow( 'Assertion error: State does not hold. Details: No element with selector "#myImaginaryAnchor" found.' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A showing layer', function() {

      function triggerOutsideClick() {
         var e = new jQuery.Event( 'click' );
         e.pageX = 10;
         e.pageY = 10;
         $( window.document.body ).trigger( e );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach( function() {
         $.mockMethod( 'fadeIn', '#myLayer', $.fn.show );
         $.mockResult( 'offset', '#myLayer', { left: 20, top: 20 } );
         $.mockResult( 'outerWidth', '#myLayer', 200 );
         $.mockResult( 'outerHeight', '#myLayer', 200 );

         createLayerWithConfiguration( {
            layerElementSelector: '#myLayer',
            anchorElementSelector: '#myAnchor'
         } );
         showLayerViaDirectiveBinding();

         spyOn( scope().layer, 'hide' ).andCallThrough();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'calls hide on outside click', function() {
         triggerOutsideClick();

         expect( scope().layer.hide ).toHaveBeenCalledWith( true );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'does correctly de-register the outside click handler after hide (jira ATP-6269)', function() {
         scope().layer.hide();
         scope().layer.hide.reset();

         triggerOutsideClick();

         expect( scope().layer.hide ).not.toHaveBeenCalled();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'can be closed by force via scope event', function() {
         $rootScope.$broadcast( 'closeLayerForced' );

         expect( scope().layer.hide ).toHaveBeenCalledWith( true );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A layer configured with existing elements', function() {

      beforeEach( function() {
         $.mockResult( 'offset', '#myAnchor', { top: 400, left: 200 } );
         $.mockResult( 'height', window, 900 );
         $.mockResult( 'scrollTop', window, 0 );
         $.mockResult( 'scrollLeft', window, 0 );

         createLayerWithConfiguration( {
            layerElementSelector: '#myLayer',
            anchorElementSelector: '#myAnchor'
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         scope().layer.hide( false );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when there is enough space on top', function() {

         it( 'draws the layer on top of the anchor', function() {
            showLayerViaDirectiveBinding();

            expect( $( '#myLayer' ).css( 'top' ) ).toEqual( '100px' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'by default aligns the layer\'s center to the anchor\'s center', function() {
            showLayerViaDirectiveBinding();

            expect( $( '#myLayer' ).css( 'left' ) ).toEqual( '250px' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when it would project out of the screen to the left', function() {

            beforeEach( function() {
               $.mockResult( 'scrollLeft', window, 300 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'is moved to the right until it is completely visible', function() {
               showLayerViaDirectiveBinding();

               expect( $( '#myLayer' ).css( 'left' ) ).toEqual( '320px' );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when it would project out of the screen to the right', function() {

            beforeEach( function() {
               $.mockResult( 'width', window, 300 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'is moved to the left until it is completely visible', function() {
               showLayerViaDirectiveBinding();

               expect( $( '#myLayer' ).css( 'left' ) ).toEqual( '180px' );
            } );

         } );
         
         /////////////////////////////////////////////////////////////////////////////////////////////////////
         
         describe( 'but the space at the bottom is larger', function() {

            beforeEach( function() {
               $.mockResult( 'height', window, 1500 );
            } );
            
            //////////////////////////////////////////////////////////////////////////////////////////////////
            
            it( 'draws the layer at the bottom of the anchor', function() {
               showLayerViaDirectiveBinding();

               expect( $( '#myLayer' ).css( 'top' ) ).toEqual( '600px' );
            } );
            
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when there is only enough space at the bottom', function() {

         beforeEach( function() {
            $.mockResult( 'scrollTop', window, 300 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'draws the layer at the bottom of the anchor', function() {
            showLayerViaDirectiveBinding();

            expect( $( '#myLayer' ).css( 'top' ) ).toEqual( '600px' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when there is enough space at the right', function() {

         beforeEach( function() {
            $.mockResult( 'offset', '#myAnchor', { top: 100, left: 0 } );
            $.mockResult( 'height', window, 400 );
            $.mockResult( 'width', window, 1000 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'draws the layer right of the anchor', function() {
            showLayerViaDirectiveBinding();

            expect( $( '#myLayer' ).is( '.right' ) ).toBe( true );
            expect( $( '#myLayer' ).css( 'left' ) ).toEqual( '200px' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'by default aligns at 50% from the top to the anchor\'s center', function() {
            showLayerViaDirectiveBinding();

            expect( $( '#myLayer' ).css( 'top' ) ).toEqual( '50px' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when it would project out of the screen to the top', function() {

            beforeEach( function() {
               $.mockResult( 'scrollTop', window, 100 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'is moved to the bottom until it is completely visible', function() {
               showLayerViaDirectiveBinding();

               expect( $( '#myLayer' ).css( 'top' ) ).toEqual( 100 + layerUtils.DISTANCE_TO_WINDOW + 'px' );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when it would project out of the screen to the bottom', function() {

            beforeEach( function() {
               $.mockResult( 'height', window, 300 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'is moved to the top until it is completely visible', function() {
               showLayerViaDirectiveBinding();

               expect( $( '#myLayer' ).css( 'top' ) ).toEqual( layerUtils.DISTANCE_TO_WINDOW + 'px' );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'but the space at the left is larger', function() {

            beforeEach( function() {
               $.mockResult( 'width', window, 1400 );
               $.mockResult( 'offset', '#myAnchor', { top: 100, left: 700 } );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'draws the layer left of the anchor', function() {
               showLayerViaDirectiveBinding();

               expect( $( '#myLayer' ).css( 'left' ) ).toEqual( '600px' );
            } );

         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when there is only enough space at the left', function() {

         beforeEach( function() {
            $.mockResult( 'offset', '#myAnchor', { top: 100, left: 200 } );
            $.mockResult( 'height', window, 400 );
            $.mockResult( 'width', window, 400 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'draws the layer left of the anchor', function() {
            showLayerViaDirectiveBinding();

            expect( $( '#myLayer' ).css( 'left' ) ).toEqual( '100px' );
         } );

      } );
      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      
      describe( 'when there is not enough space anywhere', function() {
         
         // NEEDS FIX B: implement and test what needs to be done in this case.
         
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when auto focus is enabled', function() {


         it( 'it focusses the first tabbable node', function() {
            focus( 'outer_dummy_3' );
            wait( 'focus initial element' );

            runFunction( showLayerViaDirectiveBinding );
            wait( 'show the layer and focus the first inner node' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_1' );
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'on close focusses the previously focussed node again', function() {
            focus( 'outer_dummy_3' );
            wait( 'focus initial element' );

            runFunction( showLayerViaDirectiveBinding );
            wait( 'show the layer and focus the first inner node' );

            runFunction( hideLayerViaDirectiveBinding );
            wait( 'hide the layer and focus the previously focussed node again' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'outer_dummy_3' );
            } );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when feature captureFocus is enabled', function() {

         it( 'tabs forwards only through tabbable nodes in the layer on tab', function() {
            runFunction( showLayerViaDirectiveBinding );
            wait( 'show the layer' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_1' );
            } );

            pressTabKey();
            wait( 'tab press 1' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_6' );
            } );

            pressTabKey();
            wait( 'tab press 2' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_5' );
            } );

            pressTabKey();
            wait( 'tab press 3' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_1' );
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'tabs backwards only through tabbable nodes in the layer on tab + shift', function() {
            runFunction( showLayerViaDirectiveBinding );
            wait( 'show the layer' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_1' );
            } );

            pressTabKey( true );
            wait( 'tab press 1' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_5' );
            } );

            pressTabKey( true );
            wait( 'tab press 2' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_6' );
            } );

            pressTabKey( true );
            wait( 'tab press 3' );

            runs( function() {
               expect( document.activeElement.id ).toEqual( 'dummy_1' );
            } );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when feature capture focus is disabled', function() {

         beforeEach( function() {
            $rootScope.layerConfiguration = {
               layerElementSelector: '#myLayer',
               anchorElementSelector: '#myAnchor',
               captureFocus: false
            };

            spyOn( scope().layer, 'hide' ).andCallThrough();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'closes the layer on outside tab', function() {
            runFunction( showLayerViaDirectiveBinding );
            wait( 'show the layer' );

            focus( 'dummy_5' );
            wait( 'focus initial element' );

            pressTabKey();
            wait( 'tab press 1' );

            // We need to simulate the tabbing outside by setting the focus. Only sending a tab keydown event
            // is not sufficient.
            focus( 'outer_dummy_3' );
            wait( 'simulating outside tab' );

            runs( function() {
               jasmine.Clock.tick( 0 );
               expect( scope().layer.hide ).toHaveBeenCalledWith( true );
            } );

         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function pressTabKey( shift ) {
         runFunction( function() {
            var e = new jQuery.Event( 'keydown' );
            e.keyCode = 9;
            e.shiftKey = !!shift;
            $( window.document ).trigger( e );
         } );
      }

      function focus( elemId ) {
         runFunction( function() {
            document.getElementById( elemId ).focus();
         } );
      }

      var flag = false;
      function runFunction( funcToRun ) {
         runs( function() {
            flag = false;
            if( jasmine.Clock.real.setTimeout.call ) {
               jasmine.Clock.real.setTimeout.call( window, function() {
                  funcToRun();
                  flag = true;
               }, 10 );
            }
            else {
               // Internet Explorer doesn't have a call property defined on setTimeout
               jasmine.Clock.real.setTimeout( function() {
                  funcToRun();
                  flag = true;
               }, 10 );
            }
         } );
      }

      function wait( msg ) {
         waitsFor( function() {
            return flag;
         }, msg, 20 );
      }

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function showLayerViaDirectiveBinding() {
      $rootScope.$apply( function() {
         $rootScope.layerShowing = true;
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function hideLayerViaDirectiveBinding() {
      $rootScope.$apply( function() {
         $rootScope.layerShowing = false;
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createLayerWithConfiguration( configuration ) {
      insertDomFragment( simpleLayerHtml );
      $rootScope.layerConfiguration = configuration;
      $compile( $( '#testContainer' )[0] )( $rootScope );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function scope() {
      return $rootScope.$$childHead;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function insertDomFragment( fragment ) {
      if( !$( '#testContainer' ).length ) {
         $( 'body' ).append( '<div id="testContainer"></div>' );
      }

      $( '#testContainer' ).append( fragment );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function removeAllDomFragments() {
      $( '#testContainer' ).remove();
   }

} );