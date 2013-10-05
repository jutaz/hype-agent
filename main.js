var GitServer = require('git-server');
var path = require('path');
var helper = require('./lib/helper');
var conf = require("./conf.json");
var db = require('./lib/db');

helper.repos(function(repos) {
	server = new GitServer(repos, true, path.normalize(conf.dir+'/repos'));
});
