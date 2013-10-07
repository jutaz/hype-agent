var spawn = require('child_process').exec;
var path = require('path');
var em = require('git-emit');
var db = require('./db');
var conf = require('../conf.json');
var spawner = require('./spawner');

var helper = {};

helper.clone_to_dir = function(push, callback) {
	push.cwd = path.normalize(path.resolve(push.cwd));
	push.repoName = path.basename(push.cwd, '.git');
	push.cloneDir = path.resolve(push.repoName+"/"+push.commit);
	console.log(push.cloneDir);
	var command = "git clone file://"+push.cwd+" --depth=1 --branch "+push.branch+" "+push.cloneDir;
	var op = spawn(command, {cwd: path.normalize(conf.dir+"/")},
		function (error, stdout, stderr) {
			if (error) {
				callback();
			} else {
				callback(push.repoName, push);
			}
		});
}

helper.fetch = function(repo, method, push) {
	db.collection('actions').insert({
		repo: repo,
		push_data: {
			cwd: push.cwd,
			repo: push.repoName,
		},
		action: method
	}, function(err, data) {});
}

helper.push = function(repo, method, push) {
	db.collection('actions').insert({
		repo: repo,
		push_data: {
			cwd: push.cwd,
			repo: push.repoName,
		},
		action: method
	}, function(err, data) {});
	em(push.cwd).on('post-update', function(update) {
		update.name = push.name;
		update.commit = push.commit;
		update.branch = push.branch;
		update.cwd = push.cwd;
		helper.clone_to_dir(update, function(file, push) {
			helper.run(push, function() {

			});
		});
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

helper.run = function(repo, callback) {
	spawner.run(repo, function(err, app) {
		console.log(err, app);
		callback(err, app);
	});
}

module.exports = helper;