# Changelog

## Last Changes

- [#53](https://github.com/LaxarJS/laxar_uikit/issues/53): Styling buttons: refactored animation for busy state
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
  NEW FEATURE: see ticket for details
- [#34](https://github.com/LaxarJS/laxar_uikit/issues/34): Fixed `axDatepicker`, which was breaking MSIE8 by trying to set the type attribute.


## v0.10.0

- [#33](https://github.com/LaxarJS/laxar_uikit/issues/33): Improved styling of an input field with an unit sign
- [#31](https://github.com/LaxarJS/laxar_uikit/issues/31): Added new validation behavior: display of errors to the user can now be deferred.
  NEW FEATURE: see ticket for details
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
