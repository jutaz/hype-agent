var mongo = require('mongoskin');
var db = {};

if(!conf.db.database) {
	throw new Error("No DB defined. Exitting....");
	process.exit();
}

if(conf.db.username && conf.db.password) {
	db = mongo.db('mongo://'+conf.db.username+':'+conf.db.password+'@'+conf.db.host+':'+conf.db.port+'/'+conf.db.database, {'auto_reconnect': true , 'poolSize': 1 , w:1 , safe: true});
} else {
	db = mongo.db('mongo://'+conf.db.host+':'+conf.db.port+'/'+conf.db.database, {'auto_reconnect': true , 'poolSize': 1 , w:1 , safe: true});
}
db.open(function(err, data) {
	if(err) {
		throw new Error(err);
	}
});
db.on('error', function(err) {
	if(err) {
		throw new Error(err);
	}
});

module.exports = db;