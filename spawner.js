var fs = require('fs');
var spawn = require('child_process').spawn;
var logfile = "~/"+random()+".log";
var out = fs.openSync(logfile, 'a');
var err = fs.openSync(logfile, 'a');

var child = spawn('prg', [], {
	detached: true,
	stdio: [ 'ignore', out, err ]
});

child.unref();


function random() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}