let jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.get('Authorization');

    if (token) {
        jwt.verify(token, global.config.jwt_secret, function (err, decoded) {
            if (err) return res.status(401).send('Cant verify token');

            next();
        });
    } else {
        return res.status(401).send();
    }
}

module.exports = verifyToken;