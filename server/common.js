var express = exports.express = require('express');
var config = exports.config = require('./config.js')
var MongoClient = exports.MongoClient = require("mongodb").MongoClient

// JSON functions
exports.sendjson = function(res,obj){
  var objstr = JSON.stringify(obj);
  console.error('SENDJSON:'+objstr);
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

var options = { useUnifiedTopology: true ,
    auto_reconnect: true, keepAlive: 1, connectTimeoutMS: 300000, socketTimeoutMS: 0,  useNewUrlParser: true, native_parser:true, w:0 }

mongo.init = function( opts, win, fail ){
var url = "mongodb+srv://"+opts.username+":"+opts.password+"@cluster0-jkjwt.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, options,  function(err, client) {
     if (err) {
        console.error('Error opening or authenticating mongolab database')
        }
     else {
        mongo.db = client.db("logsRecord")
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
