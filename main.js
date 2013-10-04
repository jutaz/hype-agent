var GitServer = require('git-server');
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
	name:'gitter',
	anonRead:false,
	users: [ { user:newUser, permissions:['R','W'] } ],
	onSuccessful: {
		fetch: function(repo, method, push){
			console.log('Successful fetch/pull/clone on repo:',repo.name);
		},
		push: function(repo, method push){
			console.log('PUSHed:', repo, method);
			helper.clone_to_dir(repo, function(file, push) {
				fs.createReadStream(file).pipe(unzip.Extract({ path: conf.dir }));
				console.log('clone ' + file + '(' + push.branch + ')');
			});
		}
	}
}
server = new GitServer([ newRepo ], true, path.normalize(conf.dir+'/repos'));