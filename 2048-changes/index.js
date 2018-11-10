var express = require('express'); 
var cors = require('cors');
var app = express();

app.use(cors())
   .use(express.static("public"));

app.post("/submit", function(req, res) {
    res.send([]);
});

app.get("/scores.json", function(req, res) {
    res.send([]);
});

app.listen(process.env.PORT || 8888);