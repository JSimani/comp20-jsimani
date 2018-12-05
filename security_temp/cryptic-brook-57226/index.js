const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cors = require('cors')
var mongo = require('mongodb')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI

var db = MongoClient.connect(url, function(error, client) {
	db = client.db('heroku_3vpg4bdh')
})

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'pug')
    .get('/', (req, res) => {
        db.collection('scores', (error, collection) => {
            collection.find().toArray((err, results) => {
                var indexPage = '<!DOCTYPE HTML><html><head><title>2048 Game Center</title><style>html {font-family: Arial, Helvetica, sans-serif;}table, th, td {border: 1px solid black; border-collapse: collapse;}th,td {padding: 5px;}</style></head><body><h1>2048 Game Center</h1><table><tr><th>Username</th><th>Score</th><th>Timestamp</th></tr>'
                if (!err) {
                    results.sort((a, b) => {
                        var x = parseInt(a['score'])
                        var y = parseInt(b['score'])
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0))
                    })
                    for (var i = 0; i < results.length; i++) {
                        indexPage += '<tr><td>' + results[i].username + '</td><td>' + results[i].score + '</td><td>' + results[i].created_at + '</td></tr>'
                    }
                    indexPage += '</table></body></html>'
                    res.send(indexPage)
                } else {
                    indexPage += '</table></body></html>'
                    res.send(indexPage)
                }
            })
        })
    })
    .get('/scores.json', cors(), (req, res) => {
        if (req.query.username) {
            db.collection('scores', (error, collection) => {
                collection.find({ username: req.query.username }).toArray((err, results) => {
                    if (!err) {
                        results.sort((a, b) => {
                            var x = parseInt(a['score'])
                            var y = parseInt(b['score'])
                            return ((x > y) ? -1 : ((x < y) ? 1 : 0))
                        })
                        res.json(results)
                    } else {
                        res.json([])
                    }
                })
            })
        } else {
            res.json([])
        }
    })
    .post('/submit', cors(), (req, res) => {
        var username = req.body.username
        var score = req.body.score
        var grid = req.body.grid
        var date = new Date()
        var timestamp = date.toString()
        db.collection('scores', (error, collection) => {
            if (username && score && grid) {
                var toInsert = {
          	        'username': username,
                    'score': score,
                    'grid': grid,
                    'created_at': timestamp,
          	    }
                collection.insert(toInsert, (err, saved) => {
      		        if (err) {
      				    res.send(500)
      			    }
      	        })
            }
            collection.find().toArray((err, results) => {
                if (!err) {
                    results.sort((a, b) => {
                        var x = parseInt(a['score'])
                        var y = parseInt(b['score'])
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0))
                    })
                    if (results.length > 10)
                        results = results.slice(0, 10)
                    res.json(results)
                } else {
                    res.json([])
                }
            })
  	    })
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
