

# can-compilify

[CanJS](canjs.com) template precompiler for [Browserify](https://github.com/substack/node-browserify).

Compiles CanJS Stache, Mustache and EJS templates into JavaScript using the very awesome [can-compile](https://github.com/daffl/can-compile).

__This is a very early pre-release of this transform. Not recommended for production apps.__

## Usage

Install can-compilify locally:

    npm install can-compilify

You will also need CanJS installed:

    npm install canjs
    //OR
    bower install canjs

> CanJS is not compatible with CommonJS so additional configuration is required to make Browserify work with CanJS. Examples are provided below.

Then use it as Browserify transform module with `-t`:

    browserify -t can-compilify app.js > app.bundle.js

where main.js can be like:

```javascript
var template = require('./template.stache');
document.body.innerHTML = template({greeting: 'Hello'});
```

and template.stache:

```html
<h1>{{greeting}} World!</h1>
```

## Options

### CanJS Version

You can specify the CanJS version used to precompile templates using `-v` or `--version`:

    browserify -t [ can-compilify -v 2.1.0 ] main.js > bundle.js

By default the precompiler is `2.1.3`.

### Paths

Depending on how you configure browserify, you may need to specify the paths for CanJS and its view plugins. You can do this using `--can-path`, `--ejs-path`, `--mustache-path` and `--stache-path`.

    browserify -t [ can-compilify -v 2.1.0 ] main.js > bundle.js

## package.json

Transform can be configured from the package.json too.

```json
{
  "browserify": {
    "transform": [
      [
        "can-compilify",
        {
          "version": "2.1.3",
          "can-path": "path/to/can"
        }
      ]
    ]
  }
}
```

## Programmatic usage

The `configure` method of the transform can be used to create new transforms
with different defaults.

```javascript
var compilify = require("can-compilify").configure({
  version: "2.1.3"
});

var browserify = require("browserify");
var b = browserify("./main.js");
b.transform(compilify);
b.bundle().pipe(fs.createWriteStream("./bundle.js"));
```

## Examples of Configuring CanJS with Browserify

### browser and browserify-shim

This will work with the stand-alone distributable of CanJS.

In package.json:

```
{
  "browser": {
    "canjs": "./path/to/can.jquery.js",
    "canjs/stache.js": "./path/to/can.stache.js",
  },
  "browserify-shim": {
    "canjs": {
      exports: "can",
      "depends": "jquery:jQuery"
    },
    "canjs/stache.js": {
      "depends": "canjs:can"
    }
  },
  "browserify": {
    "transform": [
      "browserify-shim",
      "can-compilify"
    ]
  }
}
```

### [deamdify](https://github.com/jaredhanson/deamdify)

For use with the AMD distribution.

### [destealify](https://github.com/sykopomp/destealify)

For use with the Steal distribution or the source from GitHub.

## Changelog
