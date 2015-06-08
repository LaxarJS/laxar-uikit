
# formatter

A module for formatting values of different types to strings.

## Contents

**Module Members**
- [create](#create)

## Module Members
#### <a name="create"></a>create( type, optionalOptions )
Creates a function to format values of a given type to their according string representations. If a
value has the wrong type to be formatted using the configured `type`, the format function throws a
`TypeError`.

Note that date and time values are only accepted as simple
[ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) strings. Possible input could thus be
`'2014-03-12'` for a date and `'16:34:52'` for time, respectively.

The formatter for type `'string'` simply triggers the `toString` method of the given argument. `null`
and `undefined` result in the empty string.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| type | `String` |  the value type to create the formatter for. Can be one of `'string'`, `'integer'`, `'decimal'`, `'date'` and `'time'` |
| _optionalOptions_ | `Object` |  different options depending on the selected `type` |
| _optionalOptions.groupingSeparator_ | `String` |  the character used for thousands separation. Applicable to types `decimal` and `integer` only. Default: `','` |
| _optionalOptions.decimalSeparator_ | `String` |  the character used for fraction part separation. Applicable to type `decimal` only. Default: `'.'` |
| _optionalOptions.decimalPlaces_ | `Number` |  number of decimal places to keep in the formatted value. Applies rounding if necessary. Applicable to type `decimal` only. Default: `2` |
| _optionalOptions.decimalTruncation_ | `String` |  how to treat insignificant decimal places (trailing zeros):<br>- `'FIXED'`: uses a fraction length of exactly `decimalPlaces`, padding with zeros<br>- `'BOUNDED'`: uses a fraction length up to `decimalPlaces`, no padding<br>- `'NONE'`: unbounded fraction length (only limited by numeric precision), no padding Applicable to type `decimal` only. Default: `'FIXED'` |
| _optionalOptions.dateFormat_ | `String` |  the format used to format date values with. Applicable to type `date` only. Default: `'M/D/YYYY'` |
| _optionalOptions.timeFormat_ | `String` |  the format used to format time values with. Applicable to type `time` only. Default: `'H:m'` |

##### Returns
| Type | Description |
| ---- | ----------- |
| `Function` |  the format function as described above. Throws a `TypeError` if the provided value cannot be formatted using the configured `type` |
