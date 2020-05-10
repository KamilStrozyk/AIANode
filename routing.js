const express = require('express');
const router = express.Router();


router.get('/', (request, response) => {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        if (err) throw err;
        if (!request.session.cart) {
            request.session.cart = new Array
        }
        console.log(request.session.cart);

        var db = client.db('products');

        db.collection('products').find().toArray(function(err, result) {
            if (err) throw err;
            response.render('index', { 'products': result })
        });
        client.close();
    })

});

router.get('/cart', (request, response) => {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        if (err) throw err;
        if (!request.session.cart) {
            request.session.cart = new Array
        } else {
            var cart = req.session.cart
        }
        console.log(cart);
        var db = client.db('products');
        db.collection('products').find().toArray(function(err, result) {
            if (err) throw err;
            response.render('cart', { 'products': result.filter(x => request.session.cart.includes(x)) });
        })
        client.close();
    })

});

router.post('/add', (request, response) => {
    if (!request.session.cart) {
        request.session.cart = new Array
    }
    let id = request.body._id;
    if (request.session.cart == 0 || request.session.cart.filter(x => x.localeCompare(id) === 0).length === 0) {
        request.session.cart.push(id);
    }
    response.redirect('/');
});

module.exports = router;