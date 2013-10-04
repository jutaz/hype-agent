var GitServer = require('git-server');
var path = require('path');
var helper = require('./lib/helper');
var conf = require("./conf.json");
var db = require('./lib/db');
var repos = [];

db.collection('repos').find().toArray(function(err, repos) {
	repos.forEach(function(item) {
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
		});
	});
});
server = new GitServer(repos, true, path.normalize(conf.dir+'/repos'));
