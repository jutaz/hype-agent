var spawn = require('child_process').exec;
var path = require('path');
var conf = require('../conf.json');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	var pathToRepo = path.normalize(push.cwd);
	var name = path.basename(push.cwd, '.git');
	setTimeout(function() {
		var command = "git clone file://"+push.cwd+" --depth=1 --branch "+push.branch+" "+name+"/"+push.commit+"/";
		var op = spawn(command, {
			cwd: path.normalize(conf.dir+"/")
		},
		function (error, stdout, stderr) {
			if (error) {
				console.log('exec error: ' + error);
			} else {
				callback(name, push);
			}
		});
	}, 1000);
}


module.exports = helper;