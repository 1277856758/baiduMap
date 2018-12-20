const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, '1508B_717', (errs, decoded) => {
        if (errs) {
            res.end('error');
        }
        else {
            var address = JSON.parse(fs.readFileSync('./json/address.json', 'utf-8'));
            if (!address[decoded.user.name]) {
                address[decoded.user.name] = [];
            }
            var flag = false;
            if (!address[decoded.user.name].kg) {
                address[decoded.user.name].forEach((item, i) => {
                    if (!item.kg) {
                        item.kg = true;
                    }
                });
            }
            address[decoded.user.name].unshift(req.body.adress);
            fs.writeFileSync('./json/address.json', JSON.stringify(address));
            console.log(0);
        }
    });
};
