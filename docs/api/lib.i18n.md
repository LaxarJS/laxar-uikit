
# <a id="i18n"></a>i18n

Some utilities for working with i18n and finding the correct formats based on the configured language.

## Contents

**Module Members**

- [momentFormatForLanguageTag()](#momentFormatForLanguageTag)
- [numberFormatForLanguageTag()](#numberFormatForLanguageTag)

## Module Members

#### <a id="momentFormatForLanguageTag"></a>momentFormatForLanguageTag( languageTag )

Returns formats for usage with Moment.js for the given `languageTag`. The returned value is an object
having the properties `date` and `time`, each with an according format string. If a language tag does
not exist, `undefined` is returned instead.

Example:
```js
i18n.momentFormatForLanguageTag( 'de' ); // => { date: 'DD.MM.YYYY', time: 'HH:mm' }
i18n.momentFormatForLanguageTag( 'en-gb' ); // => { date: 'DD/MM/YYYY', time: 'HH:mm' }
i18n.momentFormatForLanguageTag( 'xy' ); // => undefined
```

##### Parameters

| Property | Type | Description |
| -------- | ---- | ----------- |
| languageTag | `String` |  the language tag to return the moment format for |

##### Returns

| Type | Description |
| ---- | ----------- |
| `Object` |  the moment format as defined above. `undefined` if not found |

#### <a id="numberFormatForLanguageTag"></a>numberFormatForLanguageTag( languageTag )

Returns number formatting characters for the given `languageTag`. The returned value is an object having
the properties `g` (grouping separator) and `d` (decimal separator), each with the according character
to use for that language tag. If a language tag does not exist, `undefined` is returned instead.

Example:
```js
i18n.momentFormatForLanguageTag( 'de' ); // => { g: '.', d: ',' }
i18n.momentFormatForLanguageTag( 'en-gb' ); // => { g: ',', d: '.' }
i18n.momentFormatForLanguageTag( 'xy' ); // => undefined
```

##### Parameters

| Property | Type | Description |
| -------- | ---- | ----------- |
| languageTag | `String` |  the language tag to return the moment format for |

##### Returns

| Type | Description |
| ---- | ----------- |
| `Object` |  the number formatting characters as defined above. `undefined` if not found |
