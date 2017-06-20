let axios = require('axios');
let User = require('../model/User');
let jwt = require('jsonwebtoken');

function authRouter(router) {

    router.post('/facebookauth', function (req, res) {
        if (!req.body.token) return res.status(500).send('No facebook token provided');

        const token = req.body.token;
        const graphApiUrl = `https://graph.facebook.com/v2.8/me?fields=id,name,first_name,last_name&access_token=${token}`

        axios.get(graphApiUrl)
            .then(response => {
                if (!response.data.id) return res.status(404).send('Found no facebook user!');

                const facebookId = response.data.id;
                const firstName = response.data.first_name;

                User.findOne({ facebookId: facebookId }, (err, user) => {
                    if (err) return res.status(500).send('Something failed');

                    if (!user) {
                        const newUser = new User({
                            facebookId: facebookId,
                            firstName: firstName,
                            interests: []
                        });

                        user.save((err) => {
                            if (err) { return res.status(500).send('Failed to save user'); }

                            res.status(200).json({ user: newUser, accessToken: createJwt(newUser) });
                        });
                    } else {

                        const foundUser = {
                            facebookId: user.facebookId,
                            firstName: user.firstName,
                            interests: user.interests
                        };

                        res.status(200).json({ user: foundUser, accessToken: createJwt(foundUser) });
                    }
                });
            })
            .catch(error => {
                return res.status(500).send(error);
            })
    });

    return router;
}

function createJwt(user) {
    const token = jwt.sign(user, global.config.jwt_secret, {
        expiresIn: 86400
    });

    return token
}

module.exports = authRouter;