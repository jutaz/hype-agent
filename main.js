var GitServer = require('git-server');
var path = require('path');
var helper = require('./lib/helper');
var unzip = require('unzip');
var fs = require('fs');
var conf = require("./conf.json");
var db = require('./lib/db');
var repos = {};

db.collection('repos').find().toArray(function(err, repos) {
	repos.forEach(function(item) {
		db.collection('users').find({"repo": item.name}).toArray(function(err, users) {
			item.users = users;
			item.onSuccessful: {
				fetch: helper.fetch,
				push: helper.push
			}
			repos.push(item);
		});
	});
});

server = new GitServer([ newRepo, newRepo2 ], true, path.normalize(conf.dir+'/repos'));
