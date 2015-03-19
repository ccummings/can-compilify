var through = require('through');
var xtend = require('xtend');
var compiler = require('can-compile');
var path = require('path');

var requirePaths = {
    'jquery': 'jquery',
    'can': 'can',
    'ejs': 'can/view/ejs/ejs',
    'stache': 'can/view/stache/stache',
    'mustache': 'can/view/mustache/mustache'
};

var defaults = {
    options: {
        normalizer: function(filename) {
            return path.relative(__dirname, filename);
        },
        version: '2.2.0'
    }
};

var templateRe = /\.(mustache|ejs|stache)$/;

function isTemplate(file) {
    return templateRe.test(file);
}

function generateRequires(paths, type) {
    var requires = ['var can = require(\'' + paths.can + '\');\n'];
    if(paths[type]) {
        requires.push('require(\'' + paths[type] + '\');\n');
    }
    return requires.join('');
}

function compile(file, opts) {
    var config = {};

    if(!isTemplate(file)) {
        return through();
    }

    var type = path.extname(file).slice(1);

    // Grab config and paths from provided options.
    if(opts) {
        config.normalizer = opts.normalizer || defaults.options.normalizer;
        config.version = opts.v || opts.version || defaults.options.version;

        if(opts['jquery-path'] || opts['can-path'] || opts['ejs-path'] || opts['stache-path'] || opts['mustache-path']) {
            config.paths = {};
            if(opts['jquery-path']){
                config.paths.jquery = opts['jquery-path'];
            }
            if(opts['can-path']){
                config.paths.can = opts['can-path'];
            }
            if(opts['ejs-path']){
                config.paths.ejs = opts['ejs-path'];
            }
            if(opts['stache-path']){
                config.paths.stache = opts['stache-path'];
            }
            if(opts['mustache-path']){
                config.paths.mustache = opts['mustache-path'];
            }
        }
    }

    config.wrapper = generateRequires(requirePaths, type) + 'module.exports={{{content}}}';

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
