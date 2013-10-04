var spawn = require('child_process').exec;
var path = require('path');
var em = require('git-emit');
var conf = require('../conf.json');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	var pathToRepo = path.normalize(push.cwd);
	var name = path.basename(push.cwd, '.git');
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
}

helper.fetch = function(repo, method, push) {
	console.log('Successful fetch/pull/clone on repo:',repo.name);
}

helper.push = function(repo, method, push) {
	console.log('PUSHed:', repo, method);
	em(push.cwd).on('post-update', function(update) {
		var timeStart = new Date().getTime();
		update.name = push.name;
		update.commit = push.commit;
		update.branch = push.branch;
		update.cwd = push.cwd;
		helper.clone_to_dir(update, function(file, push) {
			console.log('clone ' + file + '(' + push.branch + ')', "time:", (new Date().getTime()-timeStart));
		});
	});
}


module.exports = helper;