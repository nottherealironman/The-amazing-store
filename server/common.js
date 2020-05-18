
var util    = exports.util    = require('util');
var express = exports.express = require('express');
var config = exports.config = require('./config.js')
var MongoClient = exports.MongoClient = require("mongodb").MongoClient

// JSON functions

exports.readjson = function(req,win) {
  var bodyarr = [];
  req.on('data',function(chunk){
    bodyarr.push(chunk);
  })
  req.on('end',function(){
    var bodystr = bodyarr.join('');
    console.error('READJSON:'+req.url+':'+bodystr);
    var body = JSON.parse(bodystr);
    win && win(body);
  })
}

exports.sendjson = function(res,obj){
//  res.writeHead(200,{
//    'Content-Type': 'text/json', 'Cache-Control': 'private, max-age=0'});
  var objstr = JSON.stringify(obj);
  console.error('SENDJSON:'+objstr);
//  res.end( objstr );
	res.status(200).json(obj);

}

// MongoDB functions
// USE npm mongo
var mongodb = require('mongodb');

var mongo = {
  mongo: mongodb,
  db: null,
  coll: null
}

var options = {
    auto_reconnect: true, keepAlive: 1, connectTimeoutMS: 300000, socketTimeoutMS: 0,  useNewUrlParser: true, native_parser:true, w:0 }


mongo.init = function( opts, win, fail ){
//console.log(JSON.stringify(opts))
console.error('mongo: '+opts.host+':'+opts.port+'/'+opts.name)
//MongoClient.connect("mongodb://<your_username>:<your_Password>@<your_server>.mongohq.com:<your_port>/<your_dbase>", options,
MongoClient.connect("mongodb+srv://balsysr:Dlanor7@cluster0-qfh6b.mongodb.net/test?retryWrites=true", options,  function(err, client) {
     if (err) {
        console.error('Error opening or authenticating mongolab database')
        }
     else {
        mongo.db = client.db("rons_lifestream")
        win && win(mongo.db)

        }
     })
}

mongo.res = function( win, fail ){
  return function(err,res) {
    if( err ) {
      console.error('mongo:err:'+JSON.stringify(err));
      fail && 'function' == typeof(fail) && fail(err);
    }
    else {
      win && 'function' == typeof(win) && win(res);
    }
  }
}

mongo.open = function(win,fail){
  mongo.db.open(mongo.res(function(){
    console.error('mongo:ok');
    win && win();
  },fail))
}

mongo.coll = function(name,win,fail){
  mongo.db.collection(name,mongo.res(win,fail));
}

exports.mongo = mongo
