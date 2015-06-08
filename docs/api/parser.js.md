
# parser

A module for parsing strings to different value types.

## Contents

**Module Members**
- [create](#create)
- [success](#success)
- [error](#error)

## Module Members
#### <a name="create"></a>create( type, optionalOptions )
Creates a function for parsing strings to a value of the given type. The function only accepts the
string to parse as argument and returns an object yielding success or failure. The outcome can be
read from the object's attribute `ok` which is `true` in case parsing was successful, or `false`
otherwise. Additionally, when the string was parsed successfully as the a value of the given type,
the parsed value can be found under the attribute `value`.

Note that results for types `date` and `time` are not returned as JavaScript type `Date` or wrapped
otherwise, but as simple [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) strings. Thus a possible
date would be `'2014-03-12'` and a time value `'16:34:52'`.

The parser for type `'string'` will always return a successful result with the given input as the
result's value.

Example:
--------
Successful parsing:
```js
var parse = parser.create( 'decimal' );
parse( '1,435.56' ); // -> { ok: true, value: 1435.56 }
```
Failed parsing:
```js
var parse = parser.create( 'date' );
parse( 'laxar' ); // -> { ok: false }
```

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| type | `String` |  the value type to create the parser for. Can be one of `'string'`, `'integer'`, `'decimal'`, `'date'` and `'time'` |
| _optionalOptions_ | `Object` |  different options depending on the selected `type` |
| _optionalOptions.groupingSeparator_ | `String` |  the character used for thousands separation. Applicable to types `decimal` and `integer` only. Default: `','` |
| _optionalOptions.decimalSeparator_ | `String` |  the character used for fraction part separation. Applicable to type `decimal` only. Default: `'.'` |
| _optionalOptions.dateFormat_ | `String` |  the expected format for dates to parse. If the input doesn't match this format, the `optionalOptions.dateFallbackFormats` are tried. Applicable to type `date` only. Default: `'M/D/YYYY'` |
| _optionalOptions.dateFallbackFormats_ | `String` |  formats to try, when parsing with the `optionalOptions.dateFormat` failed. Applicable to type `date` only. Default: `[ 'M/D/YY' ]` |
| _optionalOptions.dateTwoDigitYearWrap_ | `Number` |  the value to decide when parsing a two digit year, if the resulting year starts with `19` or with `20`. Any value below or equal to this number results in a year of the form 20xx, whereas any value above results in a year of the form 19xx. Applicable to type `date` only. Default: `68` |
| _optionalOptions.timeFormat_ | `String` |  the expected format for times to parse. If the input doesn't match this format, the `optionalOptions.timeFallbackFormats` are tried. Applicable to type `time` only. Default: `'H:m'` |
| _optionalOptions.timeFallbackFormats_ | `String` |  formats to try, when parsing with the `optionalOptions.timeFormat` failed. Applicable to type `time` only. Default: `[ 'H', 'HHmm' ]` |

##### Returns
| Type | Description |
| ---- | ----------- |
| `Function` |  the parsing function as described above |

#### <a name="success"></a>success( value )
Creates a successful parsing result. This is useful e.g. when writing tests.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| value | `*` |  the parsing result |

##### Returns
| Type | Description |
| ---- | ----------- |
| `Object` |  the parsing result object of form `{ ok: true, value: value }` |

#### <a name="error"></a>error()
Creates a failed parsing result. This is useful e.g. when writing tests.

##### Returns
| Type | Description |
| ---- | ----------- |
| `Object` |  the parsing result object of form `{ ok: false }` |
