const fs = require('fs');
module.exports = (req, res) => {
    const user = JSON.parse(fs.readFileSync('./json/user.json', {encoding: 'utf-8'}));
    var istrue = true;
    user.list.forEach((item, i) => {
        if (req.body.user.name == item.name) {
            istrue = false;
        }
    });
    const data = {
        'code': '0',
        'msg': ''
    };
    if (istrue) {
        user.list.unshift(req.body.user);
        fs.writeFileSync('./json/user.json', JSON.stringify(user));
        data.code = '1';
        data.msg = 'success';
        res.json(data);
    }
    else {
        data.code = '0';
        data.msg = 'success';
        res.json(data);
    }
};
