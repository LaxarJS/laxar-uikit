# LaxarJS UiKit [![Build Status](https://travis-ci.org/LaxarJS/laxar-uikit.svg?branch=master)](https://travis-ci.org/LaxarJS/laxar-uikit)

> Bootstrap-compatible base styles for LaxarJS widgets, plus a few basic controls.

Additionally there is a small set of library functions publicly available.
You can learn what's in there for you, by consulting the [API docs](docs/api).


### Building LaxarJS UiKit from source

Instead of using a pre-compiled library within a project, you can also clone this repository:

```sh
git clone https://github.com/LaxarJS/laxar-uikit.git
cd laxar-uikit
npm install
```

To see changes in your application, either configure your project to work with the sources (e.g. by using webpack), or rebuild the webpack bundles by running `npm run dist`.

To run the automated karma tests:

```sh
npm test
```

To generate HTML spec runners for opening in your web browser, so that you can e.g. use the browser's developer tools:

```sh
npm run browser-spec
```

Now you can select a spec-runner by browsing to http://localhost:8082/spec-output/.
