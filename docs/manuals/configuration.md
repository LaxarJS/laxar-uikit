[<< return to the manuals](index.md)

# LaxarJS UiKit Configuration Options

There are a few global configuration options to control the default behavior of certain _LaxarJS UiKit_ controls in an application.
For details on configuration, see the _LaxarJS Core_ [https://github.com/LaxarJS/laxar/blob/master/docs/manuals/configuration.md](documentation on configuration).

The following options are available in _LaxarJS UiKit_:

| Key                                                           | Default               | Description
| :------------------------------------------------------------ | :-------------------- | :------------------
| `lib.laxar-uikit.controls.input.ngModelOptions.updateOn`      | `'default'`           | The LaxarJS `axInput` control implements the `updateOn` property of the `ngModelOptions` attribute which is expected to ship with AngularJS 1.3. It is a space-separated sequence of DOM-event names upon which to trigger a model update. The value `'default'` causes updates on `'change'` as well as on `'focusout'`. Can be overridden per-field using the `data-ng-model-options` attribute.
| `lib.laxar-uikit.controls.input.displayErrorsImmediately`     | `true`*               | If set to `true`, the `axInput` control will indicate validation errors to the user immediately upon creation. If set to `false`, validation will be indicated then the user has visited the field or when an `axInput.validate` event has been received by the control. Can be overridden per-field using the `data-ax-input-display-errors-immediately` attribute.

* The default is due to backwards compatibility. It may be changed in future major versions of _LaxarJS UiKit_, so it is recommended to set this option explicitly.
