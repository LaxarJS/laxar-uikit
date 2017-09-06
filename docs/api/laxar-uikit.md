
# <a id="laxar-uikit"></a>laxar-uikit

Provides utilities for localized parsing and formatting of values in LaxarJS applications.

## Contents

**Types**

- [laxar-uikit](#laxar-uikit)
  - [laxar-uikit.formatter](#laxar-uikit.formatter)
  - [laxar-uikit.parser](#laxar-uikit.parser)
  - [laxar-uikit.options](#laxar-uikit.options)
  - [laxar-uikit.localized()](#laxar-uikit.localized)

## Types

### <a id="laxar-uikit"></a>laxar-uikit

#### <a id="laxar-uikit.formatter"></a>laxar-uikit.formatter `Object`

Provides access to the default (non-localized) formatter.
Use `formatter.create()` to obtain a formatting function.

For details, refer to the [formatter API](lib.formatter.md).
#### <a id="laxar-uikit.parser"></a>laxar-uikit.parser `Object`

Provides access to the default (non-localized) parser.
Use `parser.create()` to obtain a formatting function.

For details, refer to the [parser API](lib.parser.md).
#### <a id="laxar-uikit.options"></a>laxar-uikit.options `Object`

Provides access to the default (non-localized) options that can be used to `create` a formatter or
parser.
#### <a id="laxar-uikit.localized"></a>laxar-uikit.localized(    a LaxarJS axI18n widget service, used to determine the correct localization for formatting/parsing )

Allows to create localized UiKit module instances, to parse/format values for the user.

##### Parameters

| Property | Type | Description |
| -------- | ---- | ----------- |
|    a LaxarJS axI18n widget service, used to determine the correct localization for formatting/parsing | `AxI18n` |   |

##### Returns

| Type | Description |
| ---- | ----------- |
| `Object` |  an object compatible to the UiKit module, but with localized formatter, parser and options properties |
