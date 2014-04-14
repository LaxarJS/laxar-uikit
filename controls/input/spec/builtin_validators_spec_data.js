/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( {
   simpleTests: [
      {
         type: 'decimal',
         initialValue: 100,
         validInput: '123,34',
         validExpected: 123.34,
         tests: [
            {
               constraint: 'maximum-value',
               constraintValue: '1000',
               inputs: [ '1500,23' ],
               expected: [ 1500.23 ]
            },
            {
               constraint: 'minimum-value',
               constraintValue: '10',
               inputs: [ '5,53' ],
               expected: [ 5.53 ]
            },
            {
               constraint: 'range',
               constraintValue: '\'10, 500\'',
               inputs: [ '5,53', '501,65' ],
               expected: [ 5.53, 501.65 ]
            },
            {
               constraint: 'required',
               constraintValue: 'true',
               inputs: [ '' ],
               expected: [ null ]
            }
         ]
      },
      {
         type: 'integer',
         initialValue: 100,
         validInput: '123',
         validExpected: 123,
         tests: [
            {
               constraint: 'maximum-value',
               constraintValue: '1000',
               inputs: [ '1500' ],
               expected: [ 1500 ]
            },
            {
               constraint: 'minimum-value',
               constraintValue: '10',
               inputs: [ '5' ],
               expected: [ 5 ]
            },
            {
               constraint: 'range',
               constraintValue: '\'10, 500\'',
               inputs: [ '5', '501' ],
               expected: [ 5, 501 ]
            },
            {
               constraint: 'required',
               constraintValue: 'true',
               inputs: [ '' ],
               expected: [ null ]
            }
         ]
      },
      {
         type: 'date',
         initialValue: '2013-01-01',
         validInput: '12.02.2013',
         validExpected: '2013-02-12',
         tests: [
            {
               constraint: 'maximum-value',
               constraintValue: '\'2013-04-01\'',
               inputs: [ '27.02.2014' ],
               expected: [ '2014-02-27' ]
            },
            {
               constraint: 'minimum-value',
               constraintValue: '\'2012-12-01\'',
               inputs: [ '27.02.2011' ],
               expected: [ '2011-02-27' ]
            },
            {
               constraint: 'range',
               constraintValue: '\'2012-12-01, 2013-04-01\'',
               inputs: [ '27.02.2011', '27.02.2014' ],
               expected: [ '2011-02-27', '2014-02-27' ]
            },
            {
               constraint: 'required',
               constraintValue: 'true',
               inputs: [ '' ],
               expected: [ null ]
            }
         ]
      },
      {
         type: 'time',
         initialValue: '12:00:00',
         validInput: '13:37',
         validExpected: '13:37:00',
         tests: [
            {
               constraint: 'maximum-value',
               constraintValue: '\'15:16:00\'',
               inputs: [ '15:37' ],
               expected: [ '15:37:00' ]
            },
            {
               constraint: 'minimum-value',
               constraintValue: '\'02:12:00\'',
               inputs: [ '01:32' ],
               expected: [ '01:32:00' ]
            },
            {
               constraint: 'range',
               constraintValue: '\'02:12:00, 15:16:00\'',
               inputs: [ '01:42', '15:42' ],
               expected: [ '01:42:00', '15:42:00' ]
            },
            {
               constraint: 'required',
               constraintValue: 'true',
               inputs: [ '' ],
               expected: [ null ]
            }
         ]
      },
      {
         type: 'string',
         initialValue: '',
         validInput: 'Hello',
         validExpected: 'Hello',
         tests: [
            {
               constraint: 'maximum-length',
               constraintValue: '10',
               inputs: [ 'Hello World' ],
               expected: [ 'Hello World' ]
            },
            {
               constraint: 'required',
               constraintValue: 'true',
               inputs: [ '', '   ', '\n' ],
               expected: [ '', '', '' ]
            }
         ]
      }
   ],

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   boundConstraintsTests: [
      {
         valueType: 'date',
         constraint: 'required',
         initialConstraintValue: true,
         secondConstraintValue: false,
         initialValue: null,
         invalidValue: '',
         resetValue: '01.01.2014'
      },
      {
         constraint: 'maximum-length',
         valueType: 'string',
         initialConstraintValue: 2,
         secondConstraintValue: 3,
         initialValue: '',
         invalidValue: 'xxx',
         resetValue: ''
      },
      {
         constraint: 'maximum-value',
         valueType: 'integer',
         initialConstraintValue: 10,
         secondConstraintValue: 100,
         initialValue: 0,
         invalidValue: 50,
         resetValue: 0
      },
      {
         constraint: 'minimum-value',
         valueType: 'integer',
         initialConstraintValue: 100,
         secondConstraintValue: 10,
         initialValue: 0,
         invalidValue: 50,
         resetValue: 0
      },
      {
         constraint: 'range',
         valueType: 'integer',
         initialConstraintValue: '1,10',
         secondConstraintValue: '1,100',
         initialValue: 1,
         invalidValue: 50,
         resetValue: 1
      }
   ]
} );