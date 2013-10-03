var spawn = require('child_process').exec;
var path = require('path');
var conf = require('../conf.json');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	var pathToRepo = path.normalize(conf.dir+"/repos/"+push.repo+".git");
	var zipPath = path.normalize(conf.dir+"/"+push.repo+push.commit+".zip");
	var op = spawn("git archive --format=zip --output=./"+push.repo+push.commit+".zip --remote=file://"+pathToRepo+" --prefix="+push.repo+"/"+path.commit+"/ "+push.branch, {
		cwd: path.normalize(conf.dir+"/")
	},
	function (error, stdout, stderr) {
		if (error) {
			console.log('exec error: ' + error);
		} else {
			callback(zipPath, push);
		}
	});
}


module.exports = helper;