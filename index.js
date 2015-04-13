var through = require('through');
var compiler = require('can-compile');
var path = require('path');
var xtend = require('xtend');
var generateRequires = require('./lib/generateRequires');

var templateRe = /\.(mustache|ejs|stache)$/;

var defaults = {
    normalizer: function(filename) {
        return path.relative(__dirname, filename);
    },
    version: '2.2.4',
    requirePaths: {
        'jquery': 'jquery',
        'can': 'can',
        'ejs': 'can/view/ejs/ejs',
        'stache': 'can/view/stache/stache',
        'mustache': 'can/view/mustache/mustache'
    }
};

function isTemplate(file) {
    return templateRe.test(file);
}

function compile(file, options) {
    if(!isTemplate(file)) {
        return through();
    }

    var type = path.extname(file).slice(1);
    var config = xtend({}, defaults, options);
    var compilerConfig = {
        paths: config.paths,
        normalizer: config.normalizer,
        version: config.version,
        wrapper: generateRequires(config.version, type, config.requirePaths) + 'module.exports={{{content}}}'
    };

    var buffer = "";
    return through(function(chunk){
        buffer += chunk.toString();
    }, function() {
        compiler([file], compilerConfig, function(err, output){
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
