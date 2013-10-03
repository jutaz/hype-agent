var pushover = require('pushover');
var path = require('path');
var helper = require('./lib/helper');
var conf = require("./conf.json");
var repos = pushover(path.normalize(conf.dir+'/repos'));

repos.on('push', function (push) {
	console.log('push ' + push.repo + '/' + push.commit + ' (' + push.branch + ')');
	push.accept();
	helper.clone_to_dir(push, function() {
		console.log('clone ' + push.repo + '/' + push.commit + ' (' + push.branch + ')');
	});
});

repos.on('fetch', function (fetch) {
	console.log('fetch ' + fetch.commit);
	fetch.accept();
});

var http = require('http');
var server = http.createServer(function (req, res) {
	repos.handle(req, res);
});

server.listen(7000);