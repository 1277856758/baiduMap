const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = (req, res) => {
    const data = {
        'code': '1',
        'msg': 'success',
        'token': '',
        'user_name': req.body.user.name
    };
    var token = jwt.sign(req.body, '1508B_717', {expiresIn: 60 * 60});
    const user = JSON.parse(fs.readFileSync('./json/user.json', {encoding: 'utf-8'}));
    var istrue = false;
    user.list.forEach((item, i) => {
        if (req.body.user.name == item.name) {
            if (req.body.user.pwd == item.pwd) {
                istrue = true;
            }
        }
    });
    if (istrue) {
        data.token = token;
        const shopingJson = JSON.parse(fs.readFileSync('./json/shoping.json', 'utf-8'));
        var users = req.body.user.name;
        if (!shopingJson[users]) {
            shopingJson[users] = [];
        }
        fs.writeFileSync('./json/shoping.json', JSON.stringify(shopingJson));
        res.json(data);
    }
    else {
        data.code = '0';
        data.msg = 'error';
        res.json(data);
    }
};
