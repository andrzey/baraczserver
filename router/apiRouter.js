let Happening = require('../model/Happening');
let uuidV4 = require('uuid/v4');

function apiRouter(router) {

    router.get('/loadhappenings', function (req, res) {
        Happening.find(function (err, happenings) {
            if (err) return res.status(500).send('Something went wrong retrieving happenings');

            res.status(200).json({ happenings: happenings });
        });
    });

    router.post('/addhappening', function (req, res) {
        if (!req.body.title) return res.status(400).send('Missing title');
        if (!req.body.place) return res.status(400).send('Missing place');
        if (!req.body.time) return res.status(400).send('Missing time');
        if (!req.body.description) return res.status(400).send('Missing description');

        const happening = new Happening({
            id: uuidV4(),
            title: req.body.title,
            place: req.body.place,
            time: req.body.time,
            description: req.body.description,
            comments: [],
            participants: []
        });

        happening.save((err, post) => {
            if (err) return res.status(500).send('Something went wrong when creating happening');

            res.status(200).json({ happening: happening });
        });
    })

    return router
}

module.exports = apiRouter;