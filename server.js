`use strict`

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/db');
const userRoutes = require('./routes/user-routes'); 

const path = require("path")
const app = express();
const http = require('http').Server(app);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', userRoutes.routes);

http.listen(config.port, () => console.log('Server started on http://localhost:' + config.port));