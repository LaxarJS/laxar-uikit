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

} );
