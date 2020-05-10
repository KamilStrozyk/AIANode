const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser');
const routing = require('./routing');

app.use((request, response, next) => {
    console.log(`${request.method} ${request.url}: ${new Date()}`);
    next();
})

app.use('/', routing);
app.use(bodyParser.json());
app.set('view engine', 'ejs');

var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
    if (err) throw err
    var db = client.db('products');
    db.collection('products').find().toArray(function(err, result) {
        if (err) throw err
            // inject sample data 
        if (result.length == 0) {
            db.collection('products').insertMany([{
                    "Brand": "Gibson",
                    "Model": "Les Paul",
                    "Price": "6000"
                },
                {
                    "Brand": "Fender",
                    "Model": "Stratocaster",
                    "Price": "4000"
                },
                {
                    "Brand": "Charvel",
                    "Model": "Guthrie Govan",
                    "Price": "2100"
                },
                {
                    "Brand": "Ibanez",
                    "Model": "AZ224F",
                    "Price": "2700"
                },
                {
                    "Brand": "Tyler",
                    "Model": "Burning Water",
                    "Price": "4500"
                }
            ]);
            console.log(result);
        };

    })
})


app.listen(port, () => console.log(`App is listening on port:`, port));