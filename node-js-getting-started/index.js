// Use Express
var express = require('express');
var app = express();

app.post("/submit", function(request, response) {
    response.send([]);
});

app.get("/scores.json", function(request, response) {
    response.send([]);
});

app.get("/", function(request, response) {
    response.send("Go away!!!");
});

app.listen(8080);