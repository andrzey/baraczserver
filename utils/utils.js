let jwt = require('jsonwebtoken');

module.exports = {
    getUserId: function (token) {
        var decoded = jwt.decode(token);

        return decoded.facebookId;
    }
};