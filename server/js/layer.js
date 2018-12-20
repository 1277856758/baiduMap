const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = (req, res) => {
    const data = {
        'code': '1',
        'msg': 'success',
        'token': '',
        'data': []
    };
    let dataList = JSON.parse(fs.readFileSync('./json/shoping.json', {encoding: 'utf-8'}));
    data.data = dataList;
    res.json(data);
};
