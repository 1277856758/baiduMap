const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = (req, res) => {
    const token = req.headers.authorization;
    var address = JSON.parse(fs.readFileSync('./json/address.json', 'utf-8'));
    jwt.verify(token, '1508B_717', (errs, decoded) => {
        if (errs) {
            res.end('error');
        }
        else {
            var address = JSON.parse(fs.readFileSync('./json/address.json', 'utf-8'));
            if (!address[decoded.user.name]) {
                address[decoded.user.name] = [];
            }
            res.json(address[decoded.user.name]);
        }
    });
};
