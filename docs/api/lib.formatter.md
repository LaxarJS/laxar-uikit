
# <a id="formatter"></a>formatter

A module for formatting values of different types to strings.

## Contents

**Module Members**

- [create()](#create)

## Module Members

#### <a id="create"></a>create( type, optionalOptions )

Creates a function to format values of a given type to a configurable string representations. If a
value has the wrong type to be formatted using the configured `type`, the format function throws a
`TypeError`.

When formatting values for display as date or time, the full datetime should always be passed if
available; either as a Date-object, or as a full [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) string,
including timezone. To format a date without time or to format a time-of-day, the respective ISO-formatted
portions can be passed instead, without TZ information.
Finally, the string "NOW" can be used which always results in the current local date/time.

Acceptable *input* values for
   - date: `"NOW", new Date(), "2014-03-22T14:52:03.444Z", "2014-03-22"`
   - time: `"NOW", new Date(), "2014-03-22T14:52:03.444Z", "14:52:03"`

The formatter for type `'string'` simply triggers the `toString` method of the given argument, while
`null` and `undefined` result in the empty string.

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
