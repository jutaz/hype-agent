var spawn = require('child_process').exec;
var path = require('path');
var conf = require('../conf.json');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	var pathToRepo = path.normalize(push.cwd);
	var name = path.basename(push.cwd, '.git');
	var zipPath = path.normalize(conf.dir+"/"+name+push.commit+".zip");
	setTimeout(function() {
		var command = "git clone file://"+push.cwd+" --depth 1 --branch "+push.branch+" "+name+"/"+push.commit+"/";
		var command2 = "git archive --format=zip --output="+zipPath+" --remote=file://"+pathToRepo+" --prefix="+name+"/"+push.commit+"/ "+push.branch;
		console.log(command);
		var op = spawn(command, {
			cwd: path.normalize(conf.dir+"/")
		},
		function (error, stdout, stderr) {
			if (error) {
				console.log('exec error: ' + error);
			} else {
				callback(zipPath, push);
			}
		});
	}, 1000);
}


module.exports = helper;