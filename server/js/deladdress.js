const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, '1508B_717', (errs, decoded) => {
        if (errs) {
            res.end('error');
        }
        else {
            var list = decoded.user.name;
            var address = JSON.parse(fs.readFileSync('./json/address.json', 'utf-8'));
            address[list].splice(req.body.index, 1);
            fs.writeFileSync('./json/address.json', JSON.stringify(address));
            res.json(address[list]);
        }
    });
};
