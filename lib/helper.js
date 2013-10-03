var spawn = require('child_process').exec;
var path = require('path');
var conf = require('../conf.json');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	var pathToRepo = path.normalize(conf.dir+"/repos/"+push.repo+".git");
	var op = spawn("git archive --format=zip --output=./"+push.repo+push.commit+".zip --remote=file://"+pathToRepo+" --prefix="+push.repo+"/ "+push.branch, {
		cwd: path.normalize(conf.dir+"/")
	},
	function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
	callback();
}


module.exports = helper;