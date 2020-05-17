const express = require('express');
const bodyParser= require('body-parser');
const app = express();

// Mongodb configuration
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://abhishek:melbourne@cluster0-jkjwt.mongodb.net/test?retryWrites=true&w=majority";
//var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to database.');
    
    const db = client.db('logsRecord');
    const logCollection = db.collection('toiletRollLogs');
    // Telling Express to use bodyParser 
    app.use(bodyParser.urlencoded({ extended: true }));
    // API Routes 
    app.post('/toiletroll/log', function(req, res) {
      //logCollection.insertOne(req.body)
      var logsArr = JSON.parse(req.body.logs);
      logsArr.forEach(function (logs) {
        logCollection.insertOne(logs);
        console.log(logs);
      });
      //logCollection.insertOne({"id":"Kleenox","date":"17/5/2020 21:21:37","latitude":-37.8044416,"longitude":144.9721856,"toiletRoll_id":"1111","num_rolls":"111","width":"11","length":"11","softness_type":"Single-Ply"})
      /*.then(result => {
        console.log(result);
      })
      .catch(error => console.error(error));*/
      
    });
    
    app.listen(3000, function(){
      console.log("Server running");
    });
    
  }) 
  .catch(error => console.log(error));


