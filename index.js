var express = require('express')
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var MongoClient = require('mongodb').MongoClient;
var db = monk('localhost:27017/nodetest1');
var url = 'mongodb://localhost:27017/test';

var app = express()
var q = 0;

var getResults = []
var finished = false;

var collection = "test"

app.use(function(req,res,next){
    req.db = db;
    next();
});

//credit stack overflow
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}

var insertDocument = function(db, obj) {
   db.collection(collection).insertOne(obj, function(err, result) {
    console.log(result);
//    callback();
  });
};

var getInfo = function(db, obj) {
  var cursor = db.collection(collection).find({});
  var arr = Object.keys(cursor).map(function (key) {return cursor[key]; console.log(cursor[key])}); //object to array
  return cursor;
};

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/findinfo', function(req, res) {
   MongoClient.connect(url, function(err, db) {
    if(err != null) {console.log(err); return;}
    p = getQuery(db, req.query)

    console.log(req.query)

    p.then(function(result) {res.json({note: result});})
    })
})

 var getQuery = function(db, query) {
    var cursor = db.collection(collection).find(query);
    return cursor.toArray();
 }

app.post('/upload', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if(err != null) return;
    q = req.body;
    insertDocument(db, q)
    p = getQuery(db, {})
    p.then(function (result) {
      res.json( { notes: result })
    })

  });
})

app.post('/delete', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if(err != null) return;
      db.collection(collection).deleteOne({TreeID : req.body.TreeID}, false)
        p = getQuery(db, {})
        p.then(function (result) {
          res.json( { notes: result })
        })
      })
  });


app.post('/edit', function(req, res) {
  MongoClient.connect(url, function(err, db)  n
    if(err != null) return;
    q = req.body;
    db.collection(collection).update({TreeID: q.TreeID},q );
    p = getQuery(db, {})
    p.then(function (result) {
      res.json( { notes: result })
    })
  })
})

app.listen(3000)
