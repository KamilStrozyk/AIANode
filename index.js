const express = require('express')
const app = express()
const port = 3000

const routing = require('./routing');

app.use('/', routing);

app.listen(port, () => console.log(`App is listening on port:`, port));