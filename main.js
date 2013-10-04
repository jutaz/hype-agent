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
			em(push.cwd).on('post-update', function(update) {
				var timeStart = new Date().getTime();
				console.log(update, push);
				helper.clone_to_dir(push, function(file, push) {
					console.log('clone ' + file + '(' + push.branch + ')', "time:", (new Date().getTime()-timeStart));
				});
			});
			console.log('PUSHed:', repo, method);
		}
	}
}
server = new GitServer([ newRepo ], true, path.normalize(conf.dir+'/repos'));
