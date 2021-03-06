const express = require('express');
const router = express.Router();


router.get('/', (request, response) => {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        if (err) throw err;
        if (!request.session.cart) {
            request.session.cart = new Array
        }

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
            var cart = request.session.cart
        }
        var db = client.db('products');
        db.collection('products').find().toArray(function(err, result) {
            if (err) throw err;
            try {
                var products = result.filter(x => cart.filter(y => y.localeCompare(x._id) === 0).length > 0);
                response.render('cart', { 'products': products });
            } catch (error) {
                response.render('cart', { 'products': [] });
            }
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
    response.redirect('/', 200);
});

router.post('/remove', (request, response) => {
    if (!request.session.cart) {
        request.session.cart = new Array
    }
    let id = request.body._id;
    if (request.session.cart.filter(x => x.localeCompare(id) === 0).length > 0) {
        request.session.cart.splice(request.session.cart.indexOf(id), 1);
    }
    response.redirect('/cart', 200);
});

router.post('/buy', (request, response) => {
    if (!request.session.cart) {
        request.session.cart = new Array
    }
    var cart = request.session.cart;

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
        if (err) throw err;

        var db = client.db('products');

        async function check() {
            let bought = true;
            await db.collection('products').find().toArray(function(err, result) {
                    if (err) throw err;
                    for (let i = 0; i < cart.length; i++) {
                        let x = cart[i];
                        if (result.filter(y => x.localeCompare(y._id) === 0).length === 0) {
                            bought = false;
                            // console.log("bought inside loop:", bought);
                        }
                    }
                })
                // console.log("bought inside check:", bought);
            return bought;
        }

        let isBought = check().then(x => {

            if (x === true) {
                for (let i = 0; i < request.session.cart.length; i++) {
                    id = request.session.cart[i];
                    db.collection('products').deleteOne({ _id: require('mongodb').ObjectID(id) });
                }
            }
        }).then(x => {
            if (x === true) {
                response.redirect('/', 200);
            } else
                response.redirect('/cart', 409);

            request.session.cart = new Array;
            client.close();
        })
    });
});


router.post('/clear', (request, response) => {
    request.session.cart = new Array;
    response.redirect('/cart', 200);
});

module.exports = router;