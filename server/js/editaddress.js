const fs = require('fs');
const jwt = require('jsonwebtoken');
module.exports = (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, '1508B_717', (errs, decoded) => {
        if (errs) {
            console.log(errs);
        }
        else {
            var mes = req.body.adress;
            var ind = req.body.index;
            var address = JSON.parse(fs.readFileSync('./json/address.json', 'utf-8'));
            if (address[decoded.user.name][ind]) {
                address[decoded.user.name].splice(req.body.index, 1, mes);
            }
            fs.writeFileSync('./json/address.json', JSON.stringify(address));
            res.json(address[decoded.user.name]);
        }
    });
};
