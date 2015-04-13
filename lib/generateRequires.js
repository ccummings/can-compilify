var semver = require('semver');
var versionMap = require('can-compile/lib/version-map.json');

module.exports = function(version, type, paths) {
    var requires = ['var can = require(\'' + paths.can + '\');\n'];
	for(var plugin in versionMap.plugins) {
		if(type === plugin && semver.satisfies(version, versionMap.plugins[plugin]) && paths[plugin]){
			requires.push('require(\'' + paths[plugin] + '\');\n');
		}
	}
    return requires.join('');
}