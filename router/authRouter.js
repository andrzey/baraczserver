let axios = require('axios');
let User = require('../model/User');
let jwt = require('jsonwebtoken');
let Post = require('../model/Post');

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
                        const user = new User({
                            facebookId: facebookId,
                            firstName: firstName
                        });

                        user.save((err) => {
                            if (err) { return res.status(500).send('Failed to save user'); }

                            res.status(200).json({ accessToken: createJwt(user) });
                        });
                    } else {
                        res.status(200).json({ accessToken: createJwt(user) });
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



/*
    router.post('/addPost', function (req, res) {
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
        });

        post.save((err, post) => {
            if (err) {
                res.status(400).send('Error when saving post');
            } else {
                res.sendStatus(200);
            }
        });
    })

    router.get('/getList', function (req, res) {
        Post.find(function (err, posts) {
            if (err) {
                res.status(404).send('Could not get any posts');
            } else {
                res.status(200).send(posts);
            }
        });
    })*/