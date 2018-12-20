const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = (req, res) => {
    const data = {
        'code': '1',
        'msg': 'success',
        'token': '',
        'data': []
    };
    let layers = req.body.layers;
    let dataList = JSON.parse(fs.readFileSync('./json/shoping.json', {encoding: 'utf-8'}));
    dataList.push(layers);
    dataList[dataList.length - 1].id = dataList.length;
    fs.writeFileSync('./json/shoping.json', JSON.stringify(dataList));
    data.data = dataList;
    res.json(data);
};
