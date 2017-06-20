let User = require('../model/User');
let jwt = require('jsonwebtoken');

function userRouter(router) {

    router.post('/updateinterests', function (req, res) {
        if (!req.body.interests) return res.status(400).send('Missing interests');

        const token = req.headers['authorization'];
        const interests = req.body.interests;
        const facebookId = getUserId(token);

        User.findOne({ facebookId: facebookId }, function (err, user) {
            if (err) throw err;
            if (user === null) return res.status(404).send(`No user with userid: ${userId} found`);

            user.interests = interests;
            
            user.save((err, post) => {
                if (err) return res.status(500).send('Error when saving user');

                res.status(200).json({ interests: user.interests });
            })
        });

    });

    return router;
}


function getUserId(token) {
    var decoded = jwt.decode(token);

    return decoded.facebookId;
}

module.exports = userRouter;