var spawn = require('child_process').exec;
var path = require('path');
var em = require('git-emit');
var db = require('./db');
var conf = require('../conf.json');
var spawner = require('../spawner');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	var pathToRepo = path.normalize(push.cwd);
	var name = path.basename(push.cwd, '.git');
	var command = "git clone file://"+push.cwd+" --depth=1 --branch "+push.branch+" "+name+"/"+push.commit+"/";
	var op = spawn(command, {cwd: path.normalize(conf.dir+"/")},
		function (error, stdout, stderr) {
			if (error) {
				console.log('exec error: ' + error);
			} else {
				callback(name, push);
			}
		});
}

helper.fetch = function(repo, method, push) {
	db.collection('actions').insert({
		repo: repo,
		push_data: push,
		action: method
	}, {w:1});
}

helper.push = function(repo, method, push) {
	db.collection('actions').insert({
		repo: repo,
		push_data: push,
		action: method
	}, {w:1});
	em(push.cwd).on('post-update', function(update) {
		update.name = push.name;
		update.commit = push.commit;
		update.branch = push.branch;
		update.cwd = push.cwd;
		helper.clone_to_dir(update, function(file, push) {});
	});
}

helper.repos = function(callback) {
	var repos = [];
	db.collection('repos').find().toArray(function(err, items) {
		items.forEach(function(item, num, all) {
			db.collection('users').find({"repos": { $in: [item.name] }}).toArray(function(err, users) {
				tmpUsers = [];
				users.forEach(function(user) {
					tmpUsers.push({user: {username: user.username, password: user.password}, permissions: user.repo_perms[item.name]});
				});
				item.users = tmpUsers;
				item.onSuccessful = {
					fetch: helper.fetch,
					push: helper.push
				}
				repos.push(item);
				if((num+1) == items.length) {
					callback(repos);
				}
			});
		});
	});
}

module.exports = helper;