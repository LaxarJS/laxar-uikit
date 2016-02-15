System.register('lib/dom.js', [], function (_export) {
   /**
    * Copyright 2014 aixigo AG
    * Released under the MIT license.
    * http://laxarjs.org/license
    */
   /**
    * Utilities for dealing with the browser DOM.
    *
    * @module dom
    */
   'use strict';

   var cssTransformPropertyName;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
    * @private
    */
   function createPrefixTest(property, setup, tearDown, test) {
      var knownPrefixes = ['', 'Moz', 'Webkit', 'O'];

      return function tester() {
         if (typeof tester._result === 'undefined') {

            tester._result = null;
            var div = document.createElement('DIV');
            div.style.visibility = 'hidden';
            div.style.position = 'absolute';
            div.style.height = '100px';
            div.style.width = '100px';
            document.body.appendChild(div);

            var prefixed = '';
            for (var i = 0; i < knownPrefixes.length; ++i) {
               prefixed = knownPrefixes[i];
               prefixed += prefixed.length > 0 ? capitalize(property) : property;

               setup(div, prefixed);

               if (test(div, prefixed) === true) {
                  tester._result = prefixed;
                  break;
               }

               tearDown(div, prefixed);
            }

            document.body.removeChild(div);
         }

         return tester._result;
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
    * @private
    */
   function capitalize(inputString) {
      if (typeof inputString !== 'string' || inputString.length < 1) {
         return inputString;
      }

      return inputString.charAt(0).toUpperCase() + inputString.slice(1);
   }

   return {
      setters: [],
      execute: function () {
         cssTransformPropertyName = createPrefixTest('transform', function (div, prefixedProperty) {
            div.style[prefixedProperty] = 'rotate(45deg)';
         }, function (div, prefixedProperty) {
            div.style[prefixedProperty] = '';
         }, function (div) {
            var rect = div.getBoundingClientRect();
            return rect.right - rect.left !== 100;
         });

         _export('cssTransformPropertyName', cssTransformPropertyName);
      }
   };
});

System.register('lib/formatter.js', ['laxar', 'moment'], function (_export) {
   /**
    * Copyright 2014 aixigo AG
    * Released under the MIT license.
    * http://laxarjs.org/license
    */
   /**
    * A module for formatting values of different types to strings.
    *
    * @module formatter
    */
   'use strict';

   var ax, moment, ISO_DATE_FORMAT, ISO_TIME_FORMAT, NUMERICAL_STRING_REGEXP, formatters;

   _export('create', create);

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createDateTimeFormatter(type, isoFormat) {
      return function (options, value) {
         if (value == null) {
            return '';
         }

         if (typeof value !== 'string') {
            throw new TypeError('Expected argument as ISO-8601 ' + type + ' string of the form ' + isoFormat + ', but got "' + typeof value + '". Value: ' + value);
         }

         var momentTime = value.toLowerCase() === 'now' ? moment() : moment(value, isoFormat, true);
         if (!momentTime.isValid()) {
            throw new TypeError('Expected argument as ISO-8601 ' + type + ' string of the form ' + isoFormat + ', but got "' + typeof value + '". Value: ' + value);
         }

         return momentTime.format(options[type + 'Format']);
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function toPrecision(number, places, truncation) {
      // Define a maximum precision for truncation=NONE, taking into account 32bit machine limits.
      // We cannot use Number.toFixed because of rounding errors in MSIE8.
      var MAX_SIGNIFICANT_PLACES = 14;
      if (truncation === 'NONE') {
         places = MAX_SIGNIFICANT_PLACES;
      }

      if (places === 0) {
         return '' + Math.round(number);
      }

      var multiplier = Math.pow(10, places);
      var str = '' + Math.round(number * multiplier) / multiplier;

      // Detect and avoid scientific notation for numbers x where |x| << 10^(-5)
      // A heuristic is used to avoid unnecessary string operations for "regular" numbers
      var absNumber = Math.abs(number);
      if (absNumber < 0.0001) {
         var exponent = parseInt(str.split('e-')[1], 10);
         if (exponent) {
            var base = '' + Math.pow(10, exponent - 1) * Math.round(absNumber * multiplier) / multiplier;
            str = number < 0 ? '-' : '';
            str += '0.' + (zeros(exponent - 1) + base.substring(2));
         }
      }

      if (truncation === 'BOUNDED' || truncation === 'NONE') {
         return str;
      }

      var tmp = str.split('.');
      if (tmp.length === 1) {
         return str + '.' + zeros(places);
      }

      return str + zeros(places - tmp[1].length);
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function zeros(count) {
      return new Array(count + 1).join('0');
   }

   /**
    * Creates a function to format values of a given type to their according string representations. If a
    * value has the wrong type to be formatted using the configured `type`, the format function throws a
    * `TypeError`.
    *
    * Note that date and time values are only accepted as simple
    * [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) strings. Possible input could thus be
    * `'2014-03-12'` for a date and `'16:34:52'` for time, respectively.
    *
    * The formatter for type `'string'` simply triggers the `toString` method of the given argument. `null`
    * and `undefined` result in the empty string.
    *
    * @param {String} type
    *    the value type to create the formatter for. Can be one of `'string'`, `'integer'`, `'decimal'`,
    *    `'date'` and `'time'`
    * @param {Object} [optionalOptions]
    *    different options depending on the selected `type`
    * @param {String} optionalOptions.groupingSeparator
    *    the character used for thousands separation. Applicable to types `decimal` and `integer` only.
    *    Default: `','`
    * @param {String} optionalOptions.decimalSeparator
    *    the character used for fraction part separation. Applicable to type `decimal` only.
    *    Default: `'.'`
    * @param {Number} optionalOptions.decimalPlaces
    *    number of decimal places to keep in the formatted value. Applies rounding if necessary. Applicable
    *    to type `decimal` only.
    *    Default: `2`
    * @param {String} optionalOptions.decimalTruncation
    *    how to treat insignificant decimal places (trailing zeros):
    *    - `'FIXED'`: uses a fraction length of exactly `decimalPlaces`, padding with zeros
    *    - `'BOUNDED'`: uses a fraction length up to `decimalPlaces`, no padding
    *    - `'NONE'`: unbounded fraction length (only limited by numeric precision), no padding
    *    Applicable to type `decimal` only.
    *    Default: `'FIXED'`
    * @param {String} optionalOptions.dateFormat
    *    the format used to format date values with. Applicable to type `date` only.
    *    Default: `'M/D/YYYY'`
    * @param {String} optionalOptions.timeFormat
    *    the format used to format time values with. Applicable to type `time` only.
    *    Default: `'H:m'`
    *
    * @return {Function}
    *    the format function as described above. Throws a `TypeError` if the provided value cannot be
    *    formatted using the configured `type`
    */

   function create(type, optionalOptions) {
      var options = ax.object.options(optionalOptions, {
         groupingSeparator: ',',
         decimalSeparator: '.',
         decimalPlaces: 2,
         decimalTruncation: 'FIXED',
         dateFormat: 'M/D/YYYY',
         timeFormat: 'H:m'
      });
      return formatters[type].bind(formatters, options);
   }

   return {
      setters: [function (_laxar) {
         ax = _laxar;
      }, function (_moment) {
         moment = _moment;
      }],
      execute: function () {
         ISO_DATE_FORMAT = 'YYYY-MM-DD';
         ISO_TIME_FORMAT = 'HH:mm:ss';
         NUMERICAL_STRING_REGEXP = /^(\+|\-)?\d+(\.\d+)?$/;

         ///////////////////////////////////////////////////////////////////////////////////////////////////////////

         formatters = {

            string: function string(options, str) {
               if (str == null) {
                  return '';
               }
               return '' + str;
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            decimal: function decimal(options, number) {
               if (number == null) {
                  return '';
               }

               if (typeof number === 'string' && NUMERICAL_STRING_REGEXP.exec(number)) {
                  number = parseFloat(number);
               } else if (typeof number !== 'number') {
                  throw new TypeError('Expected argument of type number, but got "' + typeof number + '". Value: ' + number);
               }

               var numberParts = toPrecision(number, options.decimalPlaces, options.decimalTruncation).split('.');
               var integerPart = numberParts[0].replace(/^[\-+]/, '');
               var fractionPart = numberParts[1] || '';

               var integerLength = integerPart.length - 1;
               var front = integerPart.split('').reduce(function (str, digit, index) {
                  var pos = integerLength - index;
                  return str + digit + (pos % 3 === 0 && pos !== 0 ? options.groupingSeparator : '');
               }, number < 0 ? '-' : '');

               return front + (fractionPart.length > 0 ? options.decimalSeparator + fractionPart : '');
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            integer: function integer(options, number) {
               var integerOptions = ax.object.options({ decimalPlaces: 0 }, options);
               return formatters.decimal(integerOptions, number);
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            date: createDateTimeFormatter('date', ISO_DATE_FORMAT),

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            time: createDateTimeFormatter('time', ISO_TIME_FORMAT)
         };
         ;
      }
   };
});

System.register('lib/moment_formats.js', [], function (_export) {
   /**
    * Copyright 2014 aixigo AG
    * Released under the MIT license.
    * http://laxarjs.org/license
    */
   'use strict';

   return {
      setters: [],
      execute: function () {
         _export('default', {
            'en': {
               'date': 'MM/DD/YYYY',
               'time': 'h:mm A'
            },
            'ar-ma': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'ar': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'bg': {
               'date': 'D.MM.YYYY',
               'time': 'H:mm'
            },
            'br': {
               'date': 'DD/MM/YYYY',
               'time': 'h[e]mm A'
            },
            'bs': {
               'date': 'DD. MM. YYYY',
               'time': 'H:mm'
            },
            'ca': {
               'date': 'DD/MM/YYYY',
               'time': 'H:mm'
            },
            'cs': {
               'date': 'DD.MM.YYYY',
               'time': 'H:mm'
            },
            'cv': {
               'date': 'DD-MM-YYYY',
               'time': 'HH:mm'
            },
            'da': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'de': {
               'date': 'DD.MM.YYYY',
               'time': 'HH:mm'
            },
            'el': {
               'date': 'DD/MM/YYYY',
               'time': 'h:mm A'
            },
            'en-au': {
               'date': 'DD/MM/YYYY',
               'time': 'h:mm A'
            },
            'en-ca': {
               'date': 'YYYY-MM-DD',
               'time': 'h:mm A'
            },
            'en-gb': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'eo': {
               'date': 'YYYY-MM-DD',
               'time': 'HH:mm'
            },
            'es': {
               'date': 'DD/MM/YYYY',
               'time': 'H:mm'
            },
            'et': {
               'date': 'DD.MM.YYYY',
               'time': 'H:mm'
            },
            'eu': {
               'date': 'YYYY-MM-DD',
               'time': 'HH:mm'
            },
            'fa': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'fi': {
               'date': 'DD.MM.YYYY',
               'time': 'HH.mm'
            },
            'fr-ca': {
               'date': 'YYYY-MM-DD',
               'time': 'HH:mm'
            },
            'fr': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'gl': {
               'date': 'DD/MM/YYYY',
               'time': 'H:mm'
            },
            'he': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'hi': {
               'date': 'DD/MM/YYYY',
               'time': 'A h:mm बजे'
            },
            'hr': {
               'date': 'DD. MM. YYYY',
               'time': 'H:mm'
            },
            'hu': {
               'date': 'YYYY.MM.DD.',
               'time': 'H:mm'
            },
            'id': {
               'date': 'DD/MM/YYYY',
               'time': 'HH.mm'
            },
            'is': {
               'date': 'DD/MM/YYYY',
               'time': 'H:mm'
            },
            'it': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'ja': {
               'date': 'YYYY/MM/DD',
               'time': 'Ah時m分'
            },
            'ka': {
               'date': 'DD/MM/YYYY',
               'time': 'h:mm A'
            },
            'ko': {
               'date': 'YYYY.MM.DD',
               'time': 'A h시 mm분'
            },
            'lt': {
               'date': 'YYYY-MM-DD',
               'time': 'HH:mm'
            },
            'lv': {
               'date': 'DD.MM.YYYY',
               'time': 'HH:mm'
            },
            'ml': {
               'date': 'DD/MM/YYYY',
               'time': 'A h:mm -നു'
            },
            'mr': {
               'date': 'DD/MM/YYYY',
               'time': 'A h:mm वाजता'
            },
            'ms-my': {
               'date': 'DD/MM/YYYY',
               'time': 'HH.mm'
            },
            'nb': {
               'date': 'DD.MM.YYYY',
               'time': 'H.mm'
            },
            'ne': {
               'date': 'DD/MM/YYYY',
               'time': 'Aको h:mm बजे'
            },
            'nl': {
               'date': 'DD-MM-YYYY',
               'time': 'HH:mm'
            },
            'nn': {
               'date': 'DD.MM.YYYY',
               'time': 'HH:mm'
            },
            'pl': {
               'date': 'DD.MM.YYYY',
               'time': 'HH:mm'
            },
            'pt-br': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'pt': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'ro': {
               'date': 'DD/MM/YYYY',
               'time': 'H:mm'
            },
            'ru': {
               'date': 'DD.MM.YYYY',
               'time': 'HH:mm'
            },
            'sk': {
               'date': 'DD.MM.YYYY',
               'time': 'H:mm'
            },
            'sl': {
               'date': 'DD. MM. YYYY',
               'time': 'H:mm'
            },
            'sq': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'sv': {
               'date': 'YYYY-MM-DD',
               'time': 'HH:mm'
            },
            'th': {
               'date': 'YYYY/MM/DD',
               'time': 'H นาฬิกา m นาที'
            },
            'tr': {
               'date': 'DD.MM.YYYY',
               'time': 'HH:mm'
            },
            'tzm-la': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'tzm': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'uk': {
               'date': 'DD.MM.YYYY',
               'time': 'HH:mm'
            },
            'uz': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'vn': {
               'date': 'DD/MM/YYYY',
               'time': 'HH:mm'
            },
            'zh-cn': {
               'date': 'YYYY年MMMD日',
               'time': 'Ah点mm'
            },
            'zh-tw': {
               'date': 'YYYY年MMMD日',
               'time': 'Ah點mm'
            }
         });
      }
   };
});

System.register('lib/number_formats.js', [], function (_export) {
   /**
    * Copyright 2014 aixigo AG
    * Released under the MIT license.
    * http://laxarjs.org/license
    */
   'use strict';

   return {
      setters: [],
      execute: function () {
         _export('default', {
            'en': {
               'g': ',',
               'd': '.'
            },
            'ar-ma': {
               'g': '٬',
               'd': '٫'
            },
            'ar': {
               'g': '٬',
               'd': '٫'
            },
            'bg': {
               'g': ' ',
               'd': ','
            },
            'br': {
               'g': ',',
               'd': '.'
            },
            'bs': {
               'g': ',',
               'd': '.'
            },
            'ca': {
               'g': '.',
               'd': ','
            },
            'cs': {
               'g': ' ',
               'd': ','
            },
            'cv': {
               'g': ',',
               'd': '.'
            },
            'da': {
               'g': '.',
               'd': ','
            },
            'de': {
               'g': '.',
               'd': ','
            },
            'el': {
               'g': '.',
               'd': ','
            },
            'en-au': {
               'g': ',',
               'd': '.'
            },
            'en-ca': {
               'g': ',',
               'd': '.'
            },
            'en-gb': {
               'g': ',',
               'd': '.'
            },
            'eo': {
               'g': ',',
               'd': '.'
            },
            'es': {
               'g': '.',
               'd': ','
            },
            'et': {
               'g': ' ',
               'd': ','
            },
            'eu': {
               'g': ',',
               'd': '.'
            },
            'fa': {
               'g': '٬',
               'd': '٫'
            },
            'fi': {
               'g': ' ',
               'd': ','
            },
            'fr-ca': {
               'g': ' ',
               'd': ','
            },
            'fr': {
               'g': ' ',
               'd': ','
            },
            'gl': {
               'g': ',',
               'd': '.'
            },
            'he': {
               'g': ',',
               'd': '.'
            },
            'hi': {
               'g': ',',
               'd': '.'
            },
            'hr': {
               'g': '.',
               'd': ','
            },
            'hu': {
               'g': ' ',
               'd': ','
            },
            'id': {
               'g': '.',
               'd': ','
            },
            'is': {
               'g': ',',
               'd': '.'
            },
            'it': {
               'g': '.',
               'd': ','
            },
            'ja': {
               'g': ',',
               'd': '.'
            },
            'ka': {
               'g': ',',
               'd': '.'
            },
            'ko': {
               'g': ',',
               'd': '.'
            },
            'lt': {
               'g': '.',
               'd': ','
            },
            'lv': {
               'g': ' ',
               'd': ','
            },
            'ml': {
               'g': ',',
               'd': '.'
            },
            'mr': {
               'g': ',',
               'd': '.'
            },
            'ms-my': {
               'g': ',',
               'd': '.'
            },
            'nb': {
               'g': ' ',
               'd': ','
            },
            'ne': {
               'g': ',',
               'd': '.'
            },
            'nl': {
               'g': '.',
               'd': ','
            },
            'nn': {
               'g': ',',
               'd': '.'
            },
            'pl': {
               'g': ' ',
               'd': ','
            },
            'pt-br': {
               'g': '.',
               'd': ','
            },
            'pt': {
               'g': '.',
               'd': ','
            },
            'ro': {
               'g': '.',
               'd': ','
            },
            'ru': {
               'g': ' ',
               'd': ','
            },
            'sk': {
               'g': ' ',
               'd': ','
            },
            'sl': {
               'g': '.',
               'd': ','
            },
            'sq': {
               'g': ',',
               'd': '.'
            },
            'sv': {
               'g': ' ',
               'd': ','
            },
            'th': {
               'g': ',',
               'd': '.'
            },
            'tr': {
               'g': '.',
               'd': ','
            },
            'tzm-la': {
               'g': ',',
               'd': '.'
            },
            'tzm': {
               'g': ',',
               'd': '.'
            },
            'uk': {
               'g': ' ',
               'd': ','
            },
            'uz': {
               'g': ',',
               'd': '.'
            },
            'vn': {
               'g': ',',
               'd': '.'
            },
            'zh-cn': {
               'g': ',',
               'd': '.'
            },
            'zh-tw': {
               'g': ',',
               'd': '.'
            }
         });
      }
   };
});

System.register('lib/i18n.js', ['laxar', './moment_formats', './number_formats'], function (_export) {
  /**
   * Copyright 2014 aixigo AG
   * Released under the MIT license.
   * http://laxarjs.org/license
   */
  /**
   * Some utilities for working with i18n and finding the correct formats based on the configured language.
   *
   * @module i18n
   */
  'use strict';

  var ax, momentFormats, numberFormats, DEFAULT_LANGUAGE_TAG;

  /**
   * Tries to find the language tag that is set for the current AngularJS scope. If no language tag could be
   * determined, `'en'` is returned.
   *
   * @param {Object} scope
   *    the scope to search for the `i18n` property
   *
   * @returns {String}
   *    the language tag
   */
  function languageTagFromScope(scope) {
    return ax.i18n.languageTagFromI18n(scope.$eval('i18n')) || DEFAULT_LANGUAGE_TAG;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Returns formats for usage with Moment.js for the given `languageTag`. The returned value is an object
   * having the properties `date` and `time`, each with an according format string. If a language tag does
   * not exist, `undefined` is returned instead.
   *
   * Example:
   * ```js
   * i18n.momentFormatForLanguageTag( 'de' ); // => { date: 'DD.MM.YYYY', time: 'HH:mm' }
   * i18n.momentFormatForLanguageTag( 'en-gb' ); // => { date: 'DD/MM/YYYY', time: 'HH:mm' }
   * i18n.momentFormatForLanguageTag( 'xy' ); // => undefined
   * ```
   *
   * @param {String} languageTag
   *    the language tag to return the moment format for
   *
   * @return {Object}
   *    the moment format as defined above. `undefined` if not found
   */
  function momentFormatForLanguageTag(languageTag) {
    return findMatchingFormat(momentFormats, languageTag);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Returns number formatting characters for the given `languageTag`. The returned value is an object having
   * the properties `g` (grouping separator) and `d` (decimal separator), each with the according character
   * to use for that language tag. If a language tag does not exist, `undefined` is returned instead.
   *
   * Example:
   * ```js
   * i18n.momentFormatForLanguageTag( 'de' ); // => { g: '.', d: ',' }
   * i18n.momentFormatForLanguageTag( 'en-gb' ); // => { g: ',', d: '.' }
   * i18n.momentFormatForLanguageTag( 'xy' ); // => undefined
   * ```
   *
   * @param {String} languageTag
   *    the language tag to return the moment format for
   *
   * @return {Object}
   *    the number formatting characters as defined above. `undefined` if not found
   */
  function numberFormatForLanguageTag(languageTag) {
    return findMatchingFormat(numberFormats, languageTag);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * @private
   */
  function findMatchingFormat(map, languageTag) {
    return ax.i18n.localizeRelaxed(languageTag, map, map[DEFAULT_LANGUAGE_TAG]);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  return {
    setters: [function (_laxar) {
      ax = _laxar;
    }, function (_moment_formats) {
      momentFormats = _moment_formats.momentFormats;
    }, function (_number_formats) {
      numberFormats = _number_formats.numberFormats;
    }],
    execute: function () {
      DEFAULT_LANGUAGE_TAG = 'en';

      _export('languageTagFromScope', languageTagFromScope);

      _export('momentFormatForLanguageTag', momentFormatForLanguageTag);

      _export('numberFormatForLanguageTag', numberFormatForLanguageTag);
    }
  };
});

System.register('lib/parser.js', ['laxar', 'moment'], function (_export) {
   /**
    * Copyright 2014 aixigo AG
    * Released under the MIT license.
    * http://laxarjs.org/license
    */
   /**
    * A module for parsing strings to different value types.
    *
    * @module parser
    */
   'use strict';

   var ax, moment, ISO_DATE_FORMAT, ISO_TIME_FORMAT, NUMERIC_VALUE_MATCHER, parsers;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
    * Creates a failed parsing result. This is useful e.g. when writing tests.
    *
    * @return {Object}
    *    the parsing result object of form `{ ok: false }`
    */

   _export('success', success);

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
    * Creates a function for parsing strings to a value of the given type. The function only accepts the
    * string to parse as argument and returns an object yielding success or failure. The outcome can be
    * read from the object's attribute `ok` which is `true` in case parsing was successful, or `false`
    * otherwise. Additionally, when the string was parsed successfully as the a value of the given type,
    * the parsed value can be found under the attribute `value`.
    *
    * Note that results for types `date` and `time` are not returned as JavaScript type `Date` or wrapped
    * otherwise, but as simple [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) strings. Thus a possible
    * date would be `'2014-03-12'` and a time value `'16:34:52'`.
    *
    * The parser for type `'string'` will always return a successful result with the given input as the
    * result's value.
    *
    * Example:
    * --------
    * Successful parsing:
    * ```js
    * var parse = parser.create( 'decimal' );
    * parse( '1,435.56' ); // -> { ok: true, value: 1435.56 }
    * ```
    * Failed parsing:
    * ```js
    * var parse = parser.create( 'date' );
    * parse( 'laxar' ); // -> { ok: false }
    * ```
    *
    * @param {String} type
    *    the value type to create the parser for. Can be one of `'string'`, `'integer'`, `'decimal'`,
    *    `'date'` and `'time'`
    * @param {Object} [optionalOptions]
    *    different options depending on the selected `type`
    * @param {String} optionalOptions.groupingSeparator
    *    the character used for thousands separation. Applicable to types `decimal` and `integer` only.
    *    Default: `','`
    * @param {String} optionalOptions.decimalSeparator
    *    the character used for fraction part separation. Applicable to type `decimal` only.
    *    Default: `'.'`
    * @param {String} optionalOptions.dateFormat
    *    the expected format for dates to parse. If the input doesn't match this format, the
    *    `optionalOptions.dateFallbackFormats` are tried. Applicable to type `date` only.
    *    Default: `'M/D/YYYY'`
    * @param {String} optionalOptions.dateFallbackFormats
    *    formats to try, when parsing with the `optionalOptions.dateFormat` failed. Applicable to type
    *    `date` only.
    *    Default: `[ 'M/D/YY' ]`
    * @param {Number} optionalOptions.dateTwoDigitYearWrap
    *    the value to decide when parsing a two digit year, if the resulting year starts with `19` or with
    *    `20`. Any value below or equal to this number results in a year of the form 20xx, whereas any
    *    value above results in a year of the form 19xx. Applicable to type `date` only.
    *    Default: `68`
    * @param {String} optionalOptions.timeFormat
    *    the expected format for times to parse. If the input doesn't match this format, the
    *    `optionalOptions.timeFallbackFormats` are tried. Applicable to type `time` only.
    *    Default: `'H:m'`
    * @param {String} optionalOptions.timeFallbackFormats
    *    formats to try, when parsing with the `optionalOptions.timeFormat` failed. Applicable to type
    *    `time` only.
    *    Default: `[ 'H', 'HHmm' ]`
    *
    * @return {Function}
    *    the parsing function as described above
    */

   _export('error', error);

   _export('create', create);

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createDateTimeParser(formatKey, fallbackFormatsKey, isoFormat) {
      return function (options, str) {
         var val = ('' + str).trim();

         if (val.length === 0) {
            return success(null);
         }

         var formats = [options[formatKey]];
         if (options[fallbackFormatsKey] && options[fallbackFormatsKey].length) {
            formats = options[fallbackFormatsKey].concat(formats);
         }

         var mDate = momentParse(str, formats, options);
         return mDate.isValid() ? success(mDate.format(isoFormat)) : error();
      };
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function momentParse(str, formats, options) {
      var origParseTwoDigitYear = moment.parseTwoDigitYear;
      if (options.dateTwoDigitYearWrap > -1 && options.dateTwoDigitYearWrap < 100) {
         moment.parseTwoDigitYear = function (input) {
            var int = parseInt(input, 10);
            int = isNaN(int) ? 0 : int;
            return int + (int > options.dateTwoDigitYearWrap ? 1900 : 2000);
         };
      }

      try {
         return moment(str, formats, true);
      } finally {
         moment.parseTwoDigitYear = origParseTwoDigitYear;
      }
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   /**
    * Creates a successful parsing result. This is useful e.g. when writing tests.
    *
    * @param {*} value
    *    the parsing result
    *
    * @return {Object}
    *    the parsing result object of form `{ ok: true, value: value }`
    */

   function success(val) {
      return {
         ok: true,
         value: val
      };
   }

   function error() {
      return {
         ok: false
      };
   }

   function create(type, optionalOptions) {
      var options = ax.object.options(optionalOptions, {
         groupingSeparator: ',',
         decimalSeparator: '.',
         dateFormat: 'M/D/YYYY',
         dateFallbackFormats: ['M/D/YY'],
         dateTwoDigitYearWrap: 68,
         timeFormat: 'H:m',
         timeFallbackFormats: ['H', 'HHmm']
      });
      return parsers[type].bind({}, options);
   }

   return {
      setters: [function (_laxar) {
         ax = _laxar;
      }, function (_moment) {
         moment = _moment;
      }],
      execute: function () {
         ISO_DATE_FORMAT = 'YYYY-MM-DD';
         ISO_TIME_FORMAT = 'HH:mm:ss';
         NUMERIC_VALUE_MATCHER = /^[+\-]?[0-9]*(\.[0-9]*)?$/;

         ///////////////////////////////////////////////////////////////////////////////////////////////////////////

         parsers = {

            string: function string(options, str) {
               return success(str);
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            decimal: function decimal(options, str) {
               var val = ('' + str).trim();

               if (val.length === 0) {
                  return success(null);
               }

               if (options.groupingSeparator) {
                  while (val.indexOf(options.groupingSeparator) !== -1) {
                     val = val.replace(options.groupingSeparator, '');
                  }
               }
               val = val.replace(options.decimalSeparator, '.');

               if (NUMERIC_VALUE_MATCHER.exec(val)) {
                  var parsed = parseFloat(val);
                  if (!isNaN(parsed)) {
                     return success(parsed);
                  }
               }
               return error();
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            integer: function integer(options, str) {
               var result = parsers.decimal(options, str);
               if (!result.ok || result.value === null) {
                  return result;
               }

               var integerValue = Math.round(result.value);
               if (result.value !== integerValue) {
                  return error();
               }

               return success(integerValue);
            },

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            date: createDateTimeParser('dateFormat', 'dateFallbackFormats', ISO_DATE_FORMAT),

            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            time: createDateTimeParser('timeFormat', 'timeFallbackFormats', ISO_TIME_FORMAT)

         };
      }
   };
});

System.register('laxar-uikit', ['lib/dom', 'lib/formatter', 'lib/i18n', 'lib/parser'], function (_export) {
  /**
   * Copyright 2014 aixigo AG
   * Released under the MIT license.
   * http://laxarjs.org/license
   */
  'use strict';

  var dom, formatter, i18n, parser;
  return {
    setters: [function (_libDom) {
      dom = _libDom;
    }, function (_libFormatter) {
      formatter = _libFormatter;
    }, function (_libI18n) {
      i18n = _libI18n;
    }, function (_libParser) {
      parser = _libParser;
    }],
    execute: function () {
      _export('dom', dom);

      _export('formatter', formatter);

      _export('i18n', i18n);

      _export('parser', parser);
    }
  };
});
