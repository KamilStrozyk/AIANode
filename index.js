const express = require('express')
var session=require('express-session')
const routing = require('./routing');
var bodyParser = require('body-parser');
const ejs=require('ejs')

const port = 3000

const app = express() 
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use((request, response, next) => {
    console.log(`${request.method} ${request.url}: ${new Date()}`);
    next();
})


app.use(session({
    secret: 'somebodyoncetoldmethathsworldsgonnarollme',
    resave: false,
    saveUninitialized: true,
}))

app.use('/', routing);

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
        };

    })
})


app.listen(port, () => console.log(`App is listening on port:`, port));