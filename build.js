var path = require('path');
var Builder = require('systemjs-builder');

// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('.', 'system.config.js');

builder.config({
   meta: {
      'laxar': {
         build: false
      },
      'moment': {
         build: false
      }
   },
   map: {
      'laxar-uikit': 'laxar-uikit.js'
   },
   paths: {
      'laxar-uikit': 'laxar-uikit.js'
   }
});

builder
   .bundle('laxar-uikit', 'laxar-uikit-dist.js', {
      fetch: function(load, fetch) {
         console.log( load.name );
         return fetch( load );
      }
   })
   .then(function () {
      console.log('Build complete');
   })
   .catch(function (err) {
      console.log('Build error');
      console.log(err);
   });
