# Changelog

## Last Changes


## v0.21.4

- [#109](https://github.com/LaxarJS/laxar_uikit/issues/109): axInput: fixed another moment creation from string


## v0.21.3

- [#70](https://github.com/LaxarJS/laxar_uikit/issues/70): layer: remove requirement for jQuery UI.


## v0.21.2

- [#104](https://github.com/LaxarJS/laxar_uikit/issues/104): axInput: fixed moment creation from string
- [#101](https://github.com/LaxarJS/laxar_uikit/issues/101): layer: fixed random order of tabbable nodes.
- [#100](https://github.com/LaxarJS/laxar_uikit/issues/100): axInput: fixed missing error class on syntax error when using AngularJS 1.3.


## v0.21.1

- [#99](https://github.com/LaxarJS/laxar_uikit/issues/99): require_config: added jquery dependency shims for trunk8 and bootstrap-tooltip


## v0.21.0

- [#94](https://github.com/LaxarJS/laxar_uikit/issues/94): axAffix: added missing require-configuration
- [#93](https://github.com/LaxarJS/laxar_uikit/issues/93): default.theme: changed external encoding to `utf-8`
    + NEW FEATURE: see ticket for details


## v0.20.0

- [#91](https://github.com/LaxarJS/laxar_uikit/issues/91): axInput: fixed null-pointer in string length validation
- [#90](https://github.com/LaxarJS/laxar_uikit/issues/90): axInput: added minimumLength validator for string values
    + NEW FEATURE: see ticket for details
- [#92](https://github.com/LaxarJS/laxar_uikit/issues/92): axInput: decimalTruncation (variable length format)
    + NEW FEATURE: see ticket for details
- [#88](https://github.com/LaxarJS/laxar_uikit/issues/88): default.theme: Fixed auto-prefixer configuration


## v0.19.0

- [#87](https://github.com/LaxarJS/laxar_uikit/issues/87): axInput: Changed controller implementation to be compatible with AngularJS 1.3.
- [#86](https://github.com/LaxarJS/laxar_uikit/issues/86): axInput: Fixed attaching multiple focusout handlers.
- [#85](https://github.com/LaxarJS/laxar_uikit/issues/85): axInput: Fixed endless loop if grouping separator was set to empty.
- [#84](https://github.com/LaxarJS/laxar_uikit/issues/84): axDatePicker: avoid unnecessary 404 requests for i18n 
- [#83](https://github.com/LaxarJS/laxar_uikit/issues/83): axDatePicker: performance: build calendar lazily 
- [#82](https://github.com/LaxarJS/laxar_uikit/issues/82): fix: removed console.log statement 
- [#81](https://github.com/LaxarJS/laxar_uikit/issues/81): axInput: performance: build tooltip lazily 


## v0.18.0

- [#79](https://github.com/LaxarJS/laxar_uikit/issues/79): refactoring: use `laxar.string` instead of `laxar.text` 
- [#78](https://github.com/LaxarJS/laxar_uikit/issues/78): axInput: be more strict when parsing dates


## v0.17.0

- [#77](https://github.com/LaxarJS/laxar_uikit/issues/77): Added affix control
    + NEW FEATURE: see ticket for details
- [#73](https://github.com/LaxarJS/laxar_uikit/issues/73): Updated jQuery UI to 1.11.1 and removed touch punch.
    + **BREAKING CHANGE:** see ticket for details


## v0.16.0

- [#76](https://github.com/LaxarJS/laxar_uikit/issues/76): Implemented directives for dynamic text truncation.
    + NEW FEATURE: see ticket for details
- [#74](https://github.com/LaxarJS/laxar_uikit/issues/74): DatePicker: Fixed support for ngReadonly and ngDisabled.
- [#72](https://github.com/LaxarJS/laxar_uikit/issues/72): Styling: Updated font awesome (v4.2) and bootstrap (v3.2)
- [#71](https://github.com/LaxarJS/laxar_uikit/issues/71): Styling DatePicker: Fixed color definitions.


## v0.15.0

- [#67](https://github.com/LaxarJS/laxar_uikit/issues/67): Styling: refactored default.theme
- [#69](https://github.com/LaxarJS/laxar_uikit/issues/69): layer: allowed prevention of scrolling the body when showing.
    + NEW FEATURE: see ticket for details
- [#68](https://github.com/LaxarJS/laxar_uikit/issues/68): fixed wrongly global assert in jshintrc.
- [#66](https://github.com/LaxarJS/laxar_uikit/issues/66): fixed ont-size can change depending on disabled- or error-state 
- [#65](https://github.com/LaxarJS/laxar_uikit/issues/65): axAccordion: fixed unchecked call to $apply


## v0.14.0

- [#60](https://github.com/LaxarJS/laxar_uikit/issues/60): portal, dom: deprecated dom.ensureRenderingAndApplyFunction and removed usage
- [#64](https://github.com/LaxarJS/laxar_uikit/issues/64): tests: make sure PhantomJS is installed properly, before running spec tests.
- [#63](https://github.com/LaxarJS/laxar_uikit/issues/63): Styling DatePicker: Highlighted current day
- [#62](https://github.com/LaxarJS/laxar_uikit/issues/62): Styling: extend mixin to equal col height for different widths
- [#61](https://github.com/LaxarJS/laxar_uikit/issues/61): axButtonList: fixed double click handling with debounce function


## v0.13.0

- [#59](https://github.com/LaxarJS/laxar_uikit/issues/59): Fixed width of a single col in a row
- [#58](https://github.com/LaxarJS/laxar_uikit/issues/58): Styling table: Fixed row selecton is not visible
- [#57](https://github.com/LaxarJS/laxar_uikit/issues/57): Styling table: Added new table style (skeletal)


## v0.12.0

- [#55](https://github.com/LaxarJS/laxar_uikit/issues/55): don't try to load `widget.json` in laxar_uikit specs.
- [#56](https://github.com/LaxarJS/laxar_uikit/issues/56): axConfirmButton: fixed initialization of html label
- [#54](https://github.com/LaxarJS/laxar_uikit/issues/54): Styling confirm control: fixed unnecessary linebreak
- [#53](https://github.com/LaxarJS/laxar_uikit/issues/53): Styling table: Refactored table cells with form elements
- [#52](https://github.com/LaxarJS/laxar_uikit/issues/52): Styling buttons: refactored animation for busy state
- [#51](https://github.com/LaxarJS/laxar_uikit/issues/51): Remove some obsolete NPM `devDependencies`.
- [#50](https://github.com/LaxarJS/laxar_uikit/issues/50): Removed expensive layout polling from axConfirmButton
- [#49](https://github.com/LaxarJS/laxar_uikit/issues/49): Styling status classes: Refactored
- [#48](https://github.com/LaxarJS/laxar_uikit/issues/48): Styling icons: customized icon size independent from font size
- [#47](https://github.com/LaxarJS/laxar_uikit/issues/47): added missing require path mapping for jjv and jjve.


## v0.11.0

- [#46](https://github.com/LaxarJS/laxar_uikit/issues/46): axDatePicker: Fixed wrong regional settings in Internet Explorer.
- [#44](https://github.com/LaxarJS/laxar_uikit/issues/44): axInput: added support for checkboxes.
- [#42](https://github.com/LaxarJS/laxar_uikit/issues/42): Styling global IE10: Fixed layout problems with input clear button
- [#43](https://github.com/LaxarJS/laxar_uikit/issues/43): jshintrc: disabled enforcement of dot notation for object property access.
- [#41](https://github.com/LaxarJS/laxar_uikit/issues/41): Styling table: Added border style support for sub rows
- [#40](https://github.com/LaxarJS/laxar_uikit/issues/40): Styling table: Fixed vertical alignment of buttons in a table cell
- [#39](https://github.com/LaxarJS/laxar_uikit/issues/39): Styling table: Fixed some variables can not be overwritten
- [#38](https://github.com/LaxarJS/laxar_uikit/issues/38): axInput: fixed spec test in MSIE8
- [#37](https://github.com/LaxarJS/laxar_uikit/issues/37): Added support for bootstrap table classes
- [#36](https://github.com/LaxarJS/laxar_uikit/issues/36): axInput: documented configuration options under docs/manuals/configuration.md
- [#35](https://github.com/LaxarJS/laxar_uikit/issues/35): Refactored third party dependencies
- [#32](https://github.com/LaxarJS/laxar_uikit/issues/32): axInput: Allow to validate on focusout instead of on keypress
    + NEW FEATURE: see ticket for details
- [#34](https://github.com/LaxarJS/laxar_uikit/issues/34): Fixed `axDatepicker`, which was breaking MSIE8 by trying to set the type attribute.


## v0.10.0

- [#33](https://github.com/LaxarJS/laxar_uikit/issues/33): Improved styling of an input field with an unit sign
- [#31](https://github.com/LaxarJS/laxar_uikit/issues/31): Added new validation behavior: display of errors to the user can now be deferred.
    + NEW FEATURE: see ticket for details
- [#30](https://github.com/LaxarJS/laxar_uikit/issues/30): Fix relative json messages imports (workaround for bug in requirejs-json plugin)
- [#29](https://github.com/LaxarJS/laxar_uikit/issues/29): Added additional css class to increase space between cols
- [#28](https://github.com/LaxarJS/laxar_uikit/issues/28): Added additional css class for two column layout
- [#27](https://github.com/LaxarJS/laxar_uikit/issues/27): axDatePicker now warns if yearRange is used without minDate and maxDate
- [#26](https://github.com/LaxarJS/laxar_uikit/issues/26): Added new css class to add space between two rows
- [#25](https://github.com/LaxarJS/laxar_uikit/issues/25): Updated font awesome (4.1)
- [#24](https://github.com/LaxarJS/laxar_uikit/issues/24): Fixed incorrect col indent for nested layouts
- [#23](https://github.com/LaxarJS/laxar_uikit/issues/23): Fixed datepicker on axInput with changing locale.
- [#22](https://github.com/LaxarJS/laxar_uikit/issues/22): Fixed icons depends on position of class ax-icon- or fa- in attribute.
- [#21](https://github.com/LaxarJS/laxar_uikit/issues/21): Reduce complexity to overwrite variables.
- [#20](https://github.com/LaxarJS/laxar_uikit/issues/20): Fixed ax-error class should work for labels.
- [#19](https://github.com/LaxarJS/laxar_uikit/issues/19): Made axInputRequired work for radio buttons.
- [#18](https://github.com/LaxarJS/laxar_uikit/issues/18): Fixed handling of axInputMinimum and axInputMaximum for empty field.
- [#16](https://github.com/LaxarJS/laxar_uikit/issues/16): Fixed handling of axInputRequire by triggering re-validation on change.
- [#17](https://github.com/LaxarJS/laxar_uikit/issues/17): Fixed boostrap horizontal form is not compatible with laxar uikit grid.
- [#15](https://github.com/LaxarJS/laxar_uikit/issues/15): Fixed incomplete refresh of $viewValue after format change.
- [#14](https://github.com/LaxarJS/laxar_uikit/issues/14): Fixed selection required error message for select boxes.
- [#13](https://github.com/LaxarJS/laxar_uikit/issues/13): Code formatting, added license for font-awesome and removed max-width for popovers.
- [#12](https://github.com/LaxarJS/laxar_uikit/issues/12): Moved colors form default.theme to laxar_uikit
- [#11](https://github.com/LaxarJS/laxar_uikit/issues/11): Fixed bootstrap limit of form-inline rules for view-ports.
- [#9](https://github.com/LaxarJS/laxar_uikit/issues/9): Update Bower from ~1.2.8 to ~1.3.3.
- [#8](https://github.com/LaxarJS/laxar_uikit/issues/8): The axInput control now respects the scope locale for on-focus formatting.
- [#7](https://github.com/LaxarJS/laxar_uikit/issues/7): Fixed grid depends on position of class col-lg in attribute.
- [#6](https://github.com/LaxarJS/laxar_uikit/issues/6): Now the margin-top for a button variant (sm, xs) will calculate depending on bootstrap variants.
- [#5](https://github.com/LaxarJS/laxar_uikit/issues/5): Removed console.log statements from text-ellipsis control.
- [#4](https://github.com/LaxarJS/laxar_uikit/issues/4): Fixed table style with form elements.
- [#3](https://github.com/LaxarJS/laxar_uikit/issues/3): Fixed spelling in grid classes.
- [#1](https://github.com/LaxarJS/laxar_uikit/issues/1): Fixed compass environment for execution from bower components.
