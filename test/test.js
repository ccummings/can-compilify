var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var through = require('through');

var compilify = require('../index');

var runTransform = function(file, options, cb) {
	var compiled = '';
	var file = path.join(__dirname, file);
	fs.createReadStream(file)
		.pipe(compilify(file, options))
		.pipe(through(function(buf){
			compiled += buf;
		}, function(){
			cb(compiled);
		}));
}

var expected = {
  '1.1.5': {
    ejs: "var can = require('can');\n" +
		"module.exports=can.view.preload('test_fixtures_view_ejs',can.EJS(function(_CONTEXT,_VIEW) { " +
		"with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\"<h2>\");" +
		"___v1ew.push(can.view.txt(1,'h2',0,this,function(){ " +
		"return  message }));___v1ew.push(\"</h2>\");; return ___v1ew.join('')}} }));",
    mustache: "var can = require('can');\n" +
    	"require('can/view/mustache/mustache');\n" +
		"module.exports=can.view.preload('test_fixtures_view_mustache',can.Mustache(function(_CONTEXT,_VIEW) { with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];var ___c0nt3xt = this && this.___st4ck3d ? this : [];___c0nt3xt.___st4ck3d = true;var ___st4ck = function(context, self) {var s;if (arguments.length == 1 && context) {s = !context.___st4ck3d ? [context] : context;} else if (!context.___st4ck3d) {s = [self, context];} else if (context && context === self && context.___st4ck3d) {s = context.slice(0);} else {s = context && context.___st4ck3d ? context.concat([self]) : ___st4ck(context).concat([self]);}return (s.___st4ck3d = true) && s;};___v1ew.push(\"<h2>\");___v1ew.push(can.view.txt(1,\'h2\',0,this,function(){ return can.Mustache.txt({context:___st4ck(___c0nt3xt,this),options:options},null,can.Mustache.get(\"message\",{context:___st4ck(___c0nt3xt,this),options:options},false,false));}));___v1ew.push(\"</h2>\");; return ___v1ew.join(\'\')}} }));"
  },

  '1.1.2': {
    ejs: "var can = require('can');\n" +
		"module.exports=can.view.preload('test_fixtures_view_ejs',can.EJS(function(_CONTEXT,_VIEW) { " +
		"with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\"<h2>\");" +
		"___v1ew.push(can.view.txt(1,'h2',0,this,function(){ " +
		"return  message }));___v1ew.push(\"</h2>\");; return ___v1ew.join('')}} }));",

    mustache: "var can = require('can');\n" +
    	"require('can/view/mustache/mustache');\n" +
		"module.exports=can.view.preload('test_fixtures_view_mustache',can.Mustache(function(_CONTEXT,_VIEW) { " +
		"with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];var ___c0nt3xt = []; ___c0nt3xt.___st4ck = true;" +
		"var ___st4ck = function(context, self) {var s;if (arguments.length == 1 && context) {" +
		"s = !context.___st4ck ? [context] : context;} else {" +
		"s = context && context.___st4ck ? context.concat([self]) : ___st4ck(context).concat([self]);}" +
		"return (s.___st4ck = true) && s;};___v1ew.push(\"<h2>\");" +
		"___v1ew.push(can.view.txt(1,'h2',0,this,function(){ " +
		"return can.Mustache.txt(___st4ck(___c0nt3xt,this),null," +
		"can.Mustache.get(\"message\",___st4ck(___c0nt3xt,this)));}));" +
		"___v1ew.push(\"</h2>\");; return ___v1ew.join('')}} }));"
  },

  '2.0.0': {
    ejs: "var can = require('can');\n" +
    	"require('can/view/ejs/ejs');\n" +
		"module.exports=can.view.preload('test_fixtures_view_ejs',can.EJS(function(_CONTEXT,_VIEW) { with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\nfunction(){ return  message }));\n___v1ew.push(\n\"</h2>\");; return ___v1ew.join('')}} }));",

    mustache: "var can = require('can');\n" +
		"module.exports=can.view.preload('test_fixtures_view_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\nfunction(){ return can.Mustache.txt(\n{scope:scope,options:options},\nnull,{get:\"message\"})}));\n___v1ew.push(\n\"</h2>\");; return ___v1ew.join('') }));"
  },

  '2.1.0': {
    ejs: "var can = require('can');\n" +
    	"require('can/view/ejs/ejs');\n" +
		"module.exports=can.view.preloadStringRenderer('test_fixtures_view_ejs',can.EJS(function(_CONTEXT,_VIEW) { with(_VIEW) { with (_CONTEXT) {var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\nfunction(){ return  message }));\n___v1ew.push(\n\"</h2>\");; return ___v1ew.join('')}} }));",

    mustache: "var can = require('can');\n" +
		"module.exports=can.view.preloadStringRenderer('test_fixtures_view_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(\n\"<h2>\");___v1ew.push(\ncan.view.txt(\n1,\n'h2',\n0,\nthis,\ncan.Mustache.txt(\n{scope:scope,options:options},\nnull,{get:\"message\"})));___v1ew.push(\n\"</h2>\");; return ___v1ew.join('') }));",
	stache: "var can = require('can');\n" +
    	"require('can/view/stache/stache');\n" +
		"module.exports=can.stache(\"<h2>{{message}}</h2>\")"
  }
};

for(var version in expected) {
	(function(version, expectedEJS, expectedMustache, expectedStache) {
		var is21 = version.indexOf('2.1') === 0;
		var preloadMethod = is21 ? 'preloadStringRenderer' : 'preload';

		describe('can-compilify with CanJS version ' + version, function(){
			this.timeout(5000);
			if(expectedEJS) {
				it('compiles ejs', function(done){
					runTransform('/fixtures/view.ejs', {
						version: version
					}, function(compiled){
						expect(compiled).to.be(expectedEJS);
						done();
					});
				})
			}
			if(expectedMustache) {
				it('compiles mustache', function(done){
					runTransform('/fixtures/view.mustache', {
						version: version
					}, function(compiled){
						expect(compiled).to.be(expectedMustache);
						done();
					});
				})
			}
			if(expectedStache) {
				it('compiles stache', function(done){
					runTransform('/fixtures/view.stache', {
						version: version
					}, function(compiled){
						expect(compiled).to.be(expectedStache);
						done();
					});
				})
			}
		});
	})(version, expected[version].ejs, expected[version].mustache, expected[version].stache);
}
