const express = require('express');
var cors = require('cors');
const bodyParser= require('body-parser');
const winston = require('winston');
const app = express();

app.use(cors());
// Telling Express to use bodyParser 
app.use(bodyParser.urlencoded({ extended: true }));

/* Mongodb configuration */
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://abhishek:melbourne@cluster0-jkjwt.mongodb.net/test?retryWrites=true&w=majority";

var logCollection;
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to database.');
    
    const db = client.db('logsRecord');
    logCollection = db.collection('toiletRollLogs');
    
  }) 
  .catch(error => console.log(error));
/* Mongodb configuration */

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

// API Routes for post
app.post('/toiletroll/log', function(req, res) {
      //logCollection.insertOne(req.body)
      
      var logsArr = JSON.parse(req.body.logs);
      logsArr.forEach(function (logs) {
        // Add to MongoDB database
        logCollection.insertOne(logs);
        console.log("Data inserted in mongodb");
        // Add to logs.dat file
        logger.info(logs);
      });
      res.send({msg:"Data successfully inserted into database and log file"});
});

// API Routes for post
app.get('/toiletroll/search', function(req, res){
  let type = req.query.type;
  console.log("search for "+type+" requested.");
  let data = logCollection.find({'id':type}).toArray((err, cursor) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            console.log("Request served");
            //json response message           
            return res.status(200).json({
                'toiletRollLogs': cursor
            });
        });
  //console.log(data);
  //res.send(JSON.stringify(data));
});

app.listen(3000, function(){
  console.log("Server running");
});
