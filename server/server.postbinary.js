
var common  = require('./common.js')
var config  = common.config
var mongo   = common.mongo
var util    = common.util
var uuid    = require('uuid')
//var oauth   = require('oauth')
var url     = require('url')
var request = require('request')
var express = require('express')
var fs = require('fs')
//var Cookies = common.Cookies
var bodyParser = require('body-parser');
var multer = require('multer'); 
var multer_upload


function search(req,res){
  var merr = mongoerr400(res)
  mongo.coll(
    'user',
    function(coll){
      coll.find(
        {username:{$regex:new RegExp('^'+req.params.query)}},
        {fields:['username']},
        merr(function(cursor){
          var list = []
          cursor.each(merr(function(user){
            if( user ) {
              list.push(user.username)
            }
            else {
              common.sendjson(res,{ok:true,list:list})
            }
          }))
        })
      )
    }
  )
}



function err400(res,why) {
  return function(details) {
    console.error('ERROR 400 '+why+' '+details)
    res.writeHead(400,''+why)
    res.end(''+details)
  }
}

function auth() {
  return function(req,res,next) {
    var merr = mongoerr400(res)
    console.error(req.headers)
    mongo.coll(
      'user',
      function(coll){  
        coll.findOne(
          {token:req.headers['x-lifestream-token']},
          {fields:['username']},
          merr(function(user){          
            if( user ) {
              next()
            }
            else {
              // see if required token in HTML header
              // console.error(req.url)
              var pos = req.url.indexOf('toke')
              var token = req.url.slice(pos+5)
              // console.error('token '+token)
              if (token && pos !=0) {
                 next()
                 }
              else {
              res.writeHead(401)
              res.end(JSON.stringify({ok:false,err:'unauthorized'}))
              }
            }
          })
        )
      }
    )
  }
}

var db     = null
var app = null
//console.error(config.mongohq)
mongo.init(
  {
    name:     config.mongohq.name,
    host:     config.mongohq.host,
    port:     config.mongohq.port,
    username: config.mongohq.username,
    password: config.mongohq.password,
    function(res){
      db = res
      var prefix = '/toiletRoll/'
      app = express()
      // Configuration
     app.use(bodyParser.json()); // for parsing application/json
     app.use(bodyParser.urlencoded({ extended: true })); // for parsing 
  //    var multer=require('multer')
      multer_upload = multer({ dest: './images' }).any();

      app.get(prefix + 'search/:query', search)
      app.post(prefix + ':toiletRoll/log', log)
      
      app.listen(3009)
      console.error('Server listening on port 3009')
    }
  },
  function(err){
    console.error(err)
  }
)


