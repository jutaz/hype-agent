var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var spawner = {};

spawner.parse = function(dir, callback) {
	file = fs.readFile(path.normalize(dir+"/package.json"));
	if(!file) {
		callback(new Error("package.json in "+dir+" was not found!"), null);
		return;
	}
	package = JSON.parse(file);
}

spawner.run = function() {
	var logfile = "~/"+random()+".log";
	var out = fs.openSync(logfile, 'a');
	var err = fs.openSync(logfile, 'a');
	var child = spawn('prg', [], {
		detached: true,
		stdio: [ 'ignore', out, err ]
	});

	child.unref();
}

spawner.apps = {};

spawner.random = function() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

module.exports = spawner;