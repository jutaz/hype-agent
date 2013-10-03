var pushover = require('pushover');
var path = require('path');
var helper = require('./lib/helper');
var unzip = require('unzip');
var fs = require('fs');
var conf = require("./conf.json");
var repos = pushover(path.normalize(conf.dir+'/repos'));

repos.on('push', function (push) {
	console.log('push ' + push.repo + '/' + push.commit + ' (' + push.branch + ')');
	push.accept();
	helper.clone_to_dir(push, function(file, push) {
		fs.createReadStream(file).pipe(unzip.Extract({ path: conf.dir }));
		console.log('clone ' + file + '(' + push.branch + ')');
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