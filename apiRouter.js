var axios = require('axios');
var User = require('./model/User');
var Post = require('./model/Post');

function apiRouter(router) {

    router.get('/facebookauth', function (req, res) {
        if (!req.body.token) return res.status(500).send('No facebook token provided');

        const token = req.body.token;
        const graphApiUrl = `https://graph.facebook.com/v2.8/me?fields=id,name,first_name,last_name&access_token=${token}`

        axios.get(graphApiUrl)
            .then(response => {
                if (!response.data.id) return res.status(404).send('Found no facebook user!');

                const facebookId = response.data.id;
                const firstName = response.data.first_name;

                User.findOne({ facebookId: facebookId }, (err, user) => {
                    if (err) return next(err);

                    if (!user) {
                        const user = new User({
                            facebookId: facebookId,
                            firstName: firstName
                        });

                        user.save((err) => {
                            if (err) { return next(err); }
                            
                            res.status(200).json({ token: 'Hurra!' });
                        });
                    } else {
                        res.status(200).json({ token: 'Fins' });
                    }
                });
            })
            .catch(error => {
                return next(error);
            })
    });

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
    })

    return router;
}

module.exports = apiRouter;