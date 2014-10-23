var through = require('through');
var xtend = require('xtend');
var compiler = require('can-compile');
var path = require('path');

var defaults = {
    paths: {
        'can': 'canjs',
        '.ejs': 'canjs/ejs.js',
        '.stache': 'canjs/stache.js',
        '.mustache': 'canjs/mustache.js'
    },
    options: {
        normalizer: function(filename) {
            return path.relative(__dirname, filename);
        },
        version: '2.1.3'
    }
};

var templateRe = /\.(mustache|ejs|stache)$/;

function isTemplate(file) {
    return templateRe.test(file);
}

function generateRequires(paths, ext) {
    var requires = ['var can = require(\'' + paths.can + '\');\n'];
    if(paths[ext]) {
        requires.push('require(\'' + paths[ext] + '\');\n');
    }
    return requires.join('');
}

function parseVersion(version) {
    var parts = version.split('.');
    return {
        major: parseInt(parts[0], 10),
        minor: parseInt(parts[1], 10),
        patch: parseInt(parts[2], 10) || 0
    };
}

function compile(file, opts) {
    var config = {};
    var requirePaths = {};

    if(!isTemplate(file)) {
        return through();
    }

    var ext = path.extname(file);

    // Grab config and paths from provided options.
    if(opts) {
        config.normalizer = opts.normalizer || defaults.options.normalizer;
        config.version = opts.v || opts.version || defaults.options.version;

        requirePaths.can = opts['can-path'] || defaults.paths.can;
        requirePaths['.ejs'] = opts['ejs-path'] || defaults.paths['.ejs'];
        requirePaths['.stache'] = opts['stache-path'] || defaults.paths['.stache'];
        requirePaths['.mustache'] = opts['mustache-path'] || defaults.paths['.mustache'];
    }

    // Check that the type of template is supported by the provided version.
    // We also remove entries in requirePaths when the template compiler is in CanJS.
    var version = parseVersion(config.version);
    if(version.major <= 1) {
        if(ext === '.stache') {
            throw '.stache templates are not supported by CanJS until v2.1.0 (Your version: ' + config.version + ')';
        }
        if(version.minor < 1 && ext === '.mustache') {
            throw '.mustache templates are not supported by CanJS until v1.1.0 (Your version: ' + config.version + ')';
        }
        // EJS is included in CanJS until 2.x
        delete requirePaths['.ejs'];
    } else if(version.major === 2) {
        if(version.minor < 1 && ext === '.stache') {
            throw '.stache templates are not supported by CanJS until v2.1.0 (Your version: ' + config.version + ')';
        }
        // Mustache is included in CanJS 2.x
        delete requirePaths['.mustache'];
    }

    config.wrapper = generateRequires(requirePaths, ext) + 'module.exports={{{content}}}';

    var buffer = "";
    return through(function(chunk){
        buffer += chunk.toString();
    }, function() {
        compiler([file], config, function(err, output){
            if(err) {
                this.emit('error', err);
                return;
            }
            this.queue(output);
            this.queue(null);
        }.bind(this));
    });
}

compile.configure = function(rootOpts) {
    return function(file, opts) {
        return compile(file, xtend({}, rootOpts, opts));
    };
};

module.exports = compile;
