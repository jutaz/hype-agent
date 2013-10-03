var spawn = require('child_process').exec;
var path = require('path');
var conf = require('../conf.json');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	var pathToRepo = path.normalize(conf.dir+"/repos/"+push.name+".git");
	var zipPath = path.normalize(conf.dir+"/"+push.name+".zip");
	setTimeout(function() {
		var op = spawn("git archive --format=zip --output=./"+push.name+".zip --remote=file://"+pathToRepo+" --prefix="+push.name+"/"+push.commit+"/ "+push.branch, {
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