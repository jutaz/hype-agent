var GitServer = require('git-server');
var em = require('git-emit');
var path = require('path');
var helper = require('./lib/helper');
var unzip = require('unzip');
var fs = require('fs');
var conf = require("./conf.json");
var db = require('./lib/db');

var newUser = {
	username:'demo',
	password:'demo'
}
var newRepo = {
	name:'cleaver',
	anonRead:false,
	users: [ { user:newUser, permissions:['R','W'] } ],
	onSuccessful: {
		fetch: function(repo, method, push) {
			console.log('Successful fetch/pull/clone on repo:',repo.name);
		},
		push: function(repo, method, push) {
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
	}
}

var newRepo2 = {
	name:'kloxo',
	anonRead:false,
	users: [ { user:newUser, permissions:['R','W'] } ],
	onSuccessful: {
		fetch: function(repo, method, push) {
			console.log('Successful fetch/pull/clone on repo:',repo.name);
		},
		push: function(repo, method, push) {
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
	}
}

server = new GitServer([ newRepo, newRepo2 ], true, path.normalize(conf.dir+'/repos'));
