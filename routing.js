const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/', (request, response) => {
    var MongoClient = require('mongodb').MongoClient
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        if (err) throw err

        var db = client.db('products')

        db.collection('products').find().toArray(function(err, result) {
            if (err) throw err
            response.render('index', { 'products': result })
            console.log(result)
        })
        client.close()
    })

});

router.get('/cart', (request, response) => {
    var MongoClient = require('mongodb').MongoClient
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        if (err) throw err

        var db = client.db('store')

        db.collection('products').find().toArray(function(err, result) {
            if (err) throw err
            response.render('cart', { 'products': result })

        })
        client.close()
    })

});