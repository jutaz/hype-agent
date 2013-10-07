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
	try {
		package = JSON.parse(file);
		callback(null, package);
	} catch(err) {
		callback(err, null);
	}
}

spawner.run = function(repo, callback) {
	var app = {};
	app.logfile = "~/.hype/"+spawner.random()+".log";
	app.out = fs.openSync(logfile, 'a');
	app.package = spawner.parse(repo.cloneDir, function(err, pack) {
		if(err) {
			callback(err, null);
			return;
		}
		if(!pack.main) {
			callback(new Error("Repo must have a main file!"), null);
			return;
		}
		app.file = path.resolve(repo.cloneDir+"/"+pack.main);

		app.child = spawn(app.file, [], {
			detached: true,
			stdio: [ 'ignore', out, out ]
		});

		app.child.unref();
		spawner.apps[repo.repoName] = app;
		callback(null, app);
	});
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