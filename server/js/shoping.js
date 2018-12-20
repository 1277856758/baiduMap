const jwt = require('jsonwebtoken');
const fs = require('fs');
module.exports = (req, res) => {
    const token = req.headers.authorization;

    jwt.verify(token, '1508B_717', (errs, decoded) => {
        if (errs) {
            errs.code = 1001;
            res.end(JSON.stringify(errs));
        }
        else {
            if (req.body.shopMsg) {
                var shopingJson = JSON.parse(fs.readFileSync('./json/shoping.json', 'utf-8'));
                shopingJson[decoded.user.name] = req.body.shopMsg;
                var data = shopingJson[decoded.user.name];
                fs.writeFile('./json/shoping.json', JSON.stringify(shopingJson));
            }
            else {
                res.json(JSON.parse(fs.readFileSync('./json/shoping.json', 'utf-8'))[decoded.user.name]);
            }
        }
    }
    );
};
