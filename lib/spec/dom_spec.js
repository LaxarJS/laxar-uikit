/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   '../dom'
], function( dom ) {
   'use strict';

   var testNode;

   beforeEach( function() {
      testNode = document.createElement( 'DIV' );
      testNode.style.display = 'none';
      document.body.appendChild( testNode );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   afterEach( function() {
      document.body.removeChild( testNode );
      testNode = null;
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'dom.getComputedStyle( node, property )', function() {

      it( 'returns the computed style for a given property', function() {
         expect( dom.getComputedStyle( testNode, 'display' ) ).toEqual( 'none' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'dom.ensureRenderingAndApplyFunction( node, func )', function() {

      var testNodeInner;

      beforeEach( function() {
         testNodeInner = document.createElement( 'DIV' );
         testNodeInner.style.display = 'none';
         testNode.appendChild( testNodeInner );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         testNode.removeChild( testNodeInner );
         testNodeInner = null;
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets the node and its parents display property to block during function application', function() {
         var innerDisplay;
         var outerDisplay;

         dom.ensureRenderingAndApplyFunction( testNodeInner, function() {
            innerDisplay = testNodeInner.style.display;
            outerDisplay = testNode.style.display;
         } );

         expect( innerDisplay ).toEqual( 'block' );
         expect( outerDisplay ).toEqual( 'block' );
         expect( testNodeInner.style.display ).toEqual( 'none' );
         expect( testNode.style.display ).toEqual( 'none' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets the node and its parents visibility property to hidden during function application', function() {
         var innerVisibility;
         var outerVisibility;

         dom.ensureRenderingAndApplyFunction( testNodeInner, function() {
            innerVisibility = testNodeInner.style.visibility;
            outerVisibility = testNode.style.visibility;
         } );

         expect( innerVisibility ).toEqual( 'hidden' );
         expect( outerVisibility ).toEqual( 'hidden' );
         expect( testNodeInner.style.visibility ).toEqual( '' );
         expect( testNode.style.visibility ).toEqual( '' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets the node and its parents position property to absolute during function application', function() {
         var innerPosition;
         var outerPosition;

         dom.ensureRenderingAndApplyFunction( testNodeInner, function() {
            innerPosition = testNodeInner.style.position;
            outerPosition = testNode.style.position;
         } );

         expect( innerPosition ).toEqual( 'absolute' );
         expect( outerPosition ).toEqual( 'absolute' );
         expect( testNodeInner.style.position ).toEqual( '' );
         expect( testNode.style.position ).toEqual( '' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns the functions return value', function() {
         var result = dom.ensureRenderingAndApplyFunction( testNodeInner, function() {
            return 42;
         } );

         expect( result ).toEqual( 42 );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'rethrows any exception occurred during the function call', function() {
         expect( function() {
            dom.ensureRenderingAndApplyFunction( testNodeInner, function() {
               throw 'error';
            } );
         } ).toThrow( 'error' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'resets everything even if an exception within the function occurs', function() {
         try {
            dom.ensureRenderingAndApplyFunction( testNodeInner, function() {
               throw 'error';
            } );
         }
         catch( e ) {}

         expect( testNodeInner.style.display ).toEqual( 'none' );
         expect( testNode.style.display ).toEqual( 'none' );
         expect( testNodeInner.style.visibility ).toEqual( '' );
         expect( testNode.style.visibility ).toEqual( '' );
         expect( testNodeInner.style.position ).toEqual( '' );
         expect( testNode.style.position ).toEqual( '' );
      } );


   } );

} );