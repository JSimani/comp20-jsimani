var express = require('express'); 
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser'); // Required if we need to use HTTP post parameters
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js

app.use(cors())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true })); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/2048gameserver';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    db = databaseConnection;
});

app.post("/submit", function(req, res) {
    var username = req.body.username;
    var score = req.body.score;
    var grid = req.body.grid;
    var created_at = new Date();
    
    //foodItem = foodItem.replace(/[^\w\s]/gi, ''); // remove all special characters.  Can you explain why this is important?
    var invalid = (username == null || score == null || grid == null);
    var toInsert = {
        username: username,
        score: parseInt(score),
        grid: grid,
        created_at: created_at
    };

    db.collection('scores', function(error, coll) {
        if (!invalid) {
            coll.insert(toInsert, function(error, saved) {
                if (error) {
                    res.send(500);
                }
                else {
                    db.collection('scores', function(er, collection) {
                        collection.find().sort({score: -1}).limit(10).toArray(function(err, results) {
                            if (!err) {
                                console.log(results);
                                res.send(results);
                            } else {
                                res.send([]);
                            }
                        });
                    });
                }
            });
        } else {
            res.send([]);
        }
    });
});

app.get("/scores.json", function(req, res) {
    var name = req.query.username;
    if (name == null){
        res.send([]);
    } else {
        db.collection('scores', function(er, collection) {
            collection.find({username: name}).sort({score: -1}).toArray(function(err, results) {
                if (!err) {
                    res.send(results);
                } else {
                    res.send([]);
                }
            });
        });
    }
});

app.get("/", function(req, res) {
    res.set('Content-Type', 'text/html');
    var indexPage = '';

    // Line 50: equivalent to `db.fooditems` in MongoDB client shell
    db.collection('scores', function(er, collection) {

        // Line 53: equivalent to `db.fooditems.find()` in MongoDB client shell
        collection.find().sort({score: -1}).toArray(function(err, results) {

            // All results of db.fooditems.find() will go into...
            // ...`results`.  `results` will be an array (or list)
            if (!err) {
                indexPage += "<!DOCTYPE HTML><html><head><title>2048 Game Center</title></head><body><h1>2048 Game Center</h1><table><tr><th>Name</th><th>Score</th><th>Timestamp</th></tr>";

                for (var count = 0; count < results.length; count++) {
                    indexPage += "<tr><td>" + results[count].username + "</td><td>" + results[count].score + "</td><td>" + results[count].created_at + "</td></tr>";
                }

                indexPage += "</table></body></html>"
                res.send(indexPage);
            } else {
                res.send('<!DOCTYPE HTML><html><head><title>2048 Game Center</title></head><body><h1>Whoops, something went wrong!</h1></body></html>');
            }
        });
    });
});


app.listen(process.env.PORT || 8888);





