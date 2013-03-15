//Set it up
var http = require("http"); //HTTP Server
var url = require("url"); // URL Handling
var fs = require('fs'); // Filesystem Access (writing files)
var glob = require('glob'); // Easy directory searches (from python)
var express = require('express'); //App Framework (similar to web.py abstraction)
var app = express();

app.use(express.bodyParser());
//app.use(app.router);

var bname="MQ"
var mname="localhost:27017/"

app.use("/flot", express.static(__dirname + '/flot'));

app.get('/bms', function(req, res){	
	indexer = fs.readFileSync('inverter.html').toString()
    res.send(indexer);
});

app.get('/bmslog', function(req, res){	
	indexer = fs.readFileSync('bmslog.html').toString()
    res.send(indexer);
});

app.get('/plotarbin', function(req, res){	
	indexer = fs.readFileSync('bmsplot.html').toString()
    res.send(indexer);
});

app.get('/plotbms', function(req, res){	
	indexer = fs.readFileSync('bmsplot_bms.html').toString()
    res.send(indexer);
});

app.get('/', function(req, res){	
	indexer = fs.readFileSync('inverter.html').toString()
    res.send(indexer);
});

//Used to show sensor data
app.post('/getsensor1',sensorStuff,function(req, res){
	res.send(req.app.settings)
});

//Used to show sensor data
app.post('/getsensor2',sensorStuff,function(req, res){
	res.send(req.app.settings)
});

//Used to get load data
app.post('/getdata',getStuff,function(req, res){
	res.send(req.app.settings)
});

//Start listener on this port
app.listen(80);
console.log('Express server started');


//get last sensor readings
function sensorStuff(req,res)
{
	console.log("Start Sensor: " + req.body.data)
	var foo = JSON.parse(req.body.data)
	var collection = foo.collection
	var q = foo.query
	var l = undefined
	var s = {}	
	var f = {}
	if (foo.limit != undefined) l = foo.limit
	if (foo.sort != undefined) s = foo.sort
	if (foo.fields != undefined) f = foo.fields
	
	var db=DBConnect();
	
	if (q == '') q = null;
		
	db.collection(collection).find(q,f).limit(l).sort(s).count(function(err,count) {
		db.collection(collection).find(q,f).limit(l).sort(s).toArray(function(err,data) {
			if(err) throw err;
			//console.log("data=" + data);
			res.send({collect:collection,data:data});
			DBClose(db);	
		})			
	})
	
	
		
}

//Get realtime data for plots
function getStuff(req,res)
{
	console.log("Start Data: " + req.body.data)
	var foo = JSON.parse(req.body.data)
	var collection = foo.collection
	var q = foo.query
	var l = undefined
	var s = {}	
	var f = {}
	if (foo.limit != undefined) l = foo.limit
	if (foo.sort != undefined) s = foo.sort
	if (foo.fields != undefined) f = foo.fields
	if (q == '') q = null

	var db=DBConnect()
	db.collection(collection).find(q,f).limit(l).sort(s).toArray(function(err,data)
	{
		if(err) throw err;
		res.send({collect:collection,data:data})	
		DBClose(db)
		//console.log("...Data=" + data)
	})
	
	console.log("End Data")
}

function DBConnect() {//MongoDB stuff
	
	try {

		var mongo = require('mongoskin');
		var ops = {};
		
		var db = mongo.db(mname + bname, ops)

		console.log("open db")
	}
	catch (err) {
		console.log(err)
	}
	
	return db
}

function DBClose(db) {//MongoDB stuff
	
	try {
		db.close();
		console.log("close db")
	}
	catch (err) {
		console.log(err)
	}
}

