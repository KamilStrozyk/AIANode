const express = require('express');
const router = express.Router();

router.all('/', (request, response) => {
    response.send("Hello, World!")
});

module.exports = router;