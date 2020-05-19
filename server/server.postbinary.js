
var common  = require('./common.js');
var config  = common.config;
var mongo   = common.mongo;
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const winston = require('winston');

/*Logger configuration*/
var logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: './logs/logs.dat'
    })
  ]
});
/*Logger configuration*/

// Method to insert data into mongodb
function log(req, res) {
      //logCollection.insertOne(req.body)
      var merr = mongoerr400(res)
      var logsArr = JSON.parse(req.body.logs);
      logsArr.forEach(function (logs) {
        // Add to logs.dat file
        logger.info(logs);
        // Add to MongoDB database
        mongo.coll(
        'toiletRollLogs',
        function(coll){
          coll.insertOne(logs,
                merr(function(){
                  common.sendjson(res,{ok:true,"msg":"Data successfully inserted into database and log file"})
                })
              )
        });
        console.log("Data inserted in mongodb");
        
      });
      //res.send({msg:"Data successfully inserted into database and log file"});
}

// Method to search data from mongodb
function search(req,res){
  var type = {'id':req.query.type};
  var merr = mongoerr400(res)
  mongo.coll(
    'toiletRollLogs',
    function(coll){
      coll.find(type).toArray((err, cursor) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            console.log("Request served");
            //json response message   
            common.sendjson(res,{ok:true,'toiletRollLogs': cursor})
        });
    }
  )
}

// Message to display mongodb error
function mongoerr400(res){
  return function(win){
    return mongo.res(
      win,
      function(dataerr) {
        err400(res)(dataerr)
      }
    )
  }
}

// Method to display server error
function err400(res,why) {
  return function(details) {
    console.error('ERROR 400 '+why+' '+details)
    res.writeHead(400,''+why)
    res.end(''+details)
  }
}

// Mongodb configuration
var db     = null
var app = null

mongo.init(
  {
    name:     config.mongohq.name,
    host:     config.mongohq.host,
    port:     config.mongohq.port,
    username: config.mongohq.username,
    password: config.mongohq.password},
    function(res){
    db = res
    var prefix = '/toiletRoll/'
    app = express()
    // Configuration
    app.use(cors());
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing 

    app.get(prefix + 'search', search) // search route
    app.post(prefix + 'log', log) // post route
      
    app.listen(3000)
      console.error('Server listening on port 3000')
    }
  ,
  function(err){
    console.error(err)
  }
)


