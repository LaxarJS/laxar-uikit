/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import { object } from 'laxar';
import momentFormats from './moment_formats';
import numberFormats from './number_formats';
import * as formatter from './formatter';
import * as parser from './parser';

export function create( defaults = {} ) {
   function options( optionalOptions ) {
      return object.options( defaults, optionalOptions );
   }

   return {
      options,
      formatter: {
         ...formatter,
         create( type, optionalOptions ) {
            return formatter.create( type, options( optionalOptions ) );
         }
      },
      parser: {
         ...parser,
         create( type, optionalOptions ) {
            return parser.create( type, options( optionalOptions ) );
         }
      },
      localized( i18n ) {
         const momentFormat = i18n.localize( momentFormats );
         const numberFormat = i18n.localize( numberFormats );

         return create( {
            dateFormat: momentFormat.date,
            timeFormat: momentFormat.time,
            decimalSeparator: numberFormat.d,
            groupingSeparator: numberFormat.g
         } );
      }
   };
}
