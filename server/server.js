const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const queryApi = require('./queryApi.js');
const fs = require('fs');
require('./server1');
// const jwt = require('jsonwebtoken')
app.use(bodyparser.json());
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.post('/mall/index/getGoodsChannel', (req, res) => {
    // console.log(jwt.verify(token))
    queryApi(req.path, req.body, 'POST').then((data) => {
        res.json(JSON.parse(data));
    });
});
app.post('/mall/goods/recommendgoods', (req, res) => {
    // console.log(jwt.verify(token))
    queryApi(req.path, req.body, 'POST').then((data) => {
        res.json(JSON.parse(data));
    });
});

// map
const map = require('./js/map');
app.post('/mapData', map);

// map
const layers = require('./js/layer');
app.post('/layerDatas', layers);


app.listen(3001, () => {
    console.log('server');
});
