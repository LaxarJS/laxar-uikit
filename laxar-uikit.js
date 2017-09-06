/**
 * Copyright 2014-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */


/**
 * Provides utilities for localized parsing and formatting of values in LaxarJS applications.
 *
 * @module laxar-uikit
 */

import { create } from './lib/uikit';

const {
   formatter,
   parser,
   options,
   localized
} = create();

export {
   /**
    * Provides access to the default (non-localized) formatter.
    * Use `formatter.create()` to obtain a formatting function.
    *
    * For details, refer to the [formatter API](lib.formatter.md).
    *
    * @type {Object}
    * @name formatter
    * @memberof laxar-uikit
    */
   formatter,

   /**
    * Provides access to the default (non-localized) parser.
    * Use `parser.create()` to obtain a formatting function.
    *
    * For details, refer to the [parser API](lib.parser.md).
    *
    * @type {Object}
    * @name parser
    * @memberof laxar-uikit
    */
   parser,

   /**
    * Provides access to the default (non-localized) options that can be used to `create` a formatter or
    * parser.
    *
    * @type {Object}
    * @name options
    * @memberof laxar-uikit
    */
   options,

   /**
    * Allows to create localized UiKit module instances, to parse/format values for the user.
    *
    * @type {Function}
    * @param {AxI18n}
    *    a LaxarJS axI18n widget service, used to determine the correct localization for formatting/parsing
    * @return {Object}
    *    an object compatible to the UiKit module, but with localized formatter, parser and options properties
    *
    * @name localized
    * @memberof laxar-uikit
    */
   localized
};
