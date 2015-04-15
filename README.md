

# can-compilify

[CanJS](canjs.com) template precompiler for [Browserify](https://github.com/substack/node-browserify).

Compiles CanJS Stache, Mustache and EJS templates into JavaScript using the very awesome [can-compile](https://github.com/daffl/can-compile).

## Usage

Install can-compilify locally:

    npm install can-compilify
    
Then require templates in your app:

```javascript
var template = require('./template.stache');
document.body.innerHTML = template({greeting: 'Hello'});
```

And use can-compilify from the command line:

    browserify -t can-compilify app.js > app.bundle.js

Or add it to your package.json:

```json
{
  "browserify": {
    "transform": [
      [
        "can-compilify",
        {
          "version": "2.1.3",
        }
      ]
    ]
  }
}
```

Or programmatically:

```js
var compilify = require('can-compilify');
bundler.transform(compilify);
```

can-compilify outputs a precompiled template with the require statements needed to render the template.

With template.stache:

```html
<h1>{{greeting}} World!</h1>
```

The compipled template would be:

```js
var can = require('can');
require('can/view/stache/stache');
module.exports = can.stache('<h1>{{greeting}} World!</h1>');
```

## Options

- `version` {String} the CanJS version to be used. Default is `'2.2.4'`.
> Also available as -v on the command line
- `paths` {Object} The paths to jQuery, CanJS and view plugins.
	- `jquery` {String} path to jquery.
	- `can` {String} path to can.
	- `ejs` {String} path to ejs.
	- `mustache` {String} path to mustache.
	- `stache` {String} path to stache.
- `requirePaths` {Object} The path for the require statements.
	- `can` {String} path to can. Default is `'can'`.
	- `ejs` {String} path to ejs. Default is `'can/view/ejs/ejs'`.
	- `mustache` {String} path to mustache. Default is `'can/view/mustache/mustache'`.
	- `stache` {String} path to stache. Default is `'can/view/stache/stache'`.

## Programmatic usage

The `configure` method of the transform can be used to create new transforms
with different defaults.

```javascript
var compilify = require("can-compilify").configure({
  version: "2.1.3"
});

var browserify = require("browserify");
var b = browserify("./app.js");
b.transform(compilify);
b.bundle().pipe(fs.createWriteStream("./app.bundle.js"));
```

## Changelog

__0.1.1:__

- Upgrading can-compile to 0.9.0

__0.1.0:__

- Initial release